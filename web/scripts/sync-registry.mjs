import { access, copyFile, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(webRoot, "..");
const registryDir = path.join(repoRoot, "registry");
const generatedDir = path.join(webRoot, "src", "generated");
const siteAssetsDir = path.join(webRoot, "public", "site-assets");

const SKIP_PDF_PREVIEW = process.env.SKIP_PDF_PREVIEW === "1";

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

async function ensureCleanDir(target) {
  await rm(target, { recursive: true, force: true });
  await mkdir(target, { recursive: true });
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function readImageDimensions(filePath) {
  try {
    const buf = await readFile(filePath);
    if (buf.length < 24) return null;

    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    }

    if (buf[0] === 0xff && buf[1] === 0xd8) {
      let i = 2;
      while (i < buf.length - 1) {
        if (buf[i] !== 0xff) {
          i += 1;
          continue;
        }
        const marker = buf[i + 1];
        i += 2;
        if (marker === 0xd8 || marker === 0xd9) break;
        if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
        const segLen = buf.readUInt16BE(i);
        const isSof =
          marker >= 0xc0 &&
          marker <= 0xcf &&
          marker !== 0xc4 &&
          marker !== 0xc8 &&
          marker !== 0xcc;
        if (isSof) {
          const height = buf.readUInt16BE(i + 3);
          const width = buf.readUInt16BE(i + 5);
          return { width, height };
        }
        i += segLen;
      }
    }
  } catch {
    return null;
  }
  return null;
}

async function writeJson(filePath, payload) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

async function copyIfPresent(sourcePath, destinationPath) {
  if (!(await exists(sourcePath))) {
    return false;
  }

  await mkdir(path.dirname(destinationPath), { recursive: true });
  await copyFile(sourcePath, destinationPath);
  return true;
}

function assetUrl(...segments) {
  return `/${segments.join("/")}`;
}

function runCommand(command, args, { cwd } = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, args, { cwd, stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", () => resolve({ ok: false, code: -1, stderr: "command not found" }));
    child.on("close", (code) => resolve({ ok: code === 0, code, stderr }));
  });
}

// Rasterize the first page of a PDF into a JPEG. Tries pdftoppm (poppler) first,
// then macOS `sips`. Returns the absolute output path on success, or null otherwise.
// This is an HONEST preview: it's the first page of the actual compiled document,
// not a placeholder or stock image.
async function renderPdfPreview(pdfPath, outputDir, slug) {
  if (SKIP_PDF_PREVIEW) return null;
  if (!(await exists(pdfPath))) return null;

  await mkdir(outputDir, { recursive: true });
  const finalPath = path.join(outputDir, `${slug}.jpg`);

  // pdftoppm writes <prefix>-01.jpg for page 1.
  const pdftoppmPrefix = path.join(outputDir, `${slug}-auto`);
  const pdftoppm = await runCommand("pdftoppm", [
    "-jpeg",
    "-jpegopt",
    "quality=82",
    "-r",
    "120",
    "-f",
    "1",
    "-l",
    "1",
    "-scale-to",
    "1400",
    pdfPath,
    pdftoppmPrefix,
  ]);

  if (pdftoppm.ok) {
    const generated = `${pdftoppmPrefix}-01.jpg`;
    if (await exists(generated)) {
      await rm(finalPath, { force: true });
      await rename(generated, finalPath);
      return finalPath;
    }
  }

  // Fallback: macOS sips (handles PDF first page natively).
  const sips = await runCommand("sips", [
    "-s",
    "format",
    "jpeg",
    "--resampleWidth",
    "1400",
    pdfPath,
    "--out",
    finalPath,
  ]);
  if (sips.ok && (await exists(finalPath))) {
    return finalPath;
  }

  return null;
}

async function syncEntryAssets(entry, gaps) {
  const assets = {
    id: entry.id,
    slug: entry.slug,
    preview_image_url: null,
    preview_image_source: null, // "declared" | "auto-pdf" | null
    preview_image_width: null,
    preview_image_height: null,
    preview_document_url: null,
    download_archive_url: null,
  };

  let previewImagePath = null;

  // 1. Declared preview_image wins.
  if (entry.preview_image) {
    const sourcePath = path.join(repoRoot, entry.preview_image);
    const extension = path.extname(entry.preview_image) || ".png";
    const destinationPath = path.join(
      siteAssetsDir,
      "previews",
      "images",
      `${entry.slug}${extension}`
    );

    if (await copyIfPresent(sourcePath, destinationPath)) {
      assets.preview_image_url = assetUrl(
        "site-assets",
        "previews",
        "images",
        `${entry.slug}${extension}`
      );
      assets.preview_image_source = "declared";
      previewImagePath = destinationPath;
    }
  }

  // 2. Copy the preview document (PDF) if declared.
  const previewDocumentPath = entry.resolved_paths?.preview_document;
  let localPdfPath = null;
  if (previewDocumentPath) {
    const sourcePath = path.join(repoRoot, previewDocumentPath);
    const extension = path.extname(previewDocumentPath) || ".pdf";
    const destinationPath = path.join(
      siteAssetsDir,
      "previews",
      "documents",
      `${entry.slug}${extension}`
    );

    if (await copyIfPresent(sourcePath, destinationPath)) {
      assets.preview_document_url = assetUrl(
        "site-assets",
        "previews",
        "documents",
        `${entry.slug}${extension}`
      );
      localPdfPath = sourcePath;
    }
  }

  // 3. If no declared image but we have a PDF, render an honest preview from
  //    the first page of the actual compiled document.
  if (!assets.preview_image_url && localPdfPath) {
    const imagesDir = path.join(siteAssetsDir, "previews", "images");
    const generated = await renderPdfPreview(localPdfPath, imagesDir, entry.slug);
    if (generated) {
      assets.preview_image_url = assetUrl(
        "site-assets",
        "previews",
        "images",
        `${entry.slug}.jpg`
      );
      assets.preview_image_source = "auto-pdf";
      previewImagePath = generated;
    } else {
      gaps.push({
        slug: entry.slug,
        reason: "pdf-render-failed",
        detail: "pdftoppm and sips both unavailable or failed",
      });
    }
  } else if (!assets.preview_image_url && !localPdfPath) {
    gaps.push({ slug: entry.slug, reason: "no-preview-asset" });
  }

  // 3b. Record intrinsic pixel dimensions so the frontend can size the frame
  //     to the page, avoiding letterboxing and undersized previews.
  if (previewImagePath) {
    const dimensions = await readImageDimensions(previewImagePath);
    if (dimensions) {
      assets.preview_image_width = dimensions.width;
      assets.preview_image_height = dimensions.height;
    }
  }

  // 4. Optional prebuilt download archive.
  const archivePath = path.join(repoRoot, "assets", "downloads", `${entry.slug}.zip`);
  const archiveDestination = path.join(
    siteAssetsDir,
    "downloads",
    `${entry.slug}.zip`
  );

  if (await copyIfPresent(archivePath, archiveDestination)) {
    assets.download_archive_url = assetUrl(
      "site-assets",
      "downloads",
      `${entry.slug}.zip`
    );
  }

  return assets;
}

async function main() {
  const catalog = await readJson(path.join(registryDir, "catalog.json"));
  const templates = await readJson(path.join(registryDir, "templates.json"));

  await ensureCleanDir(generatedDir);
  await ensureCleanDir(siteAssetsDir);

  const categoryMap = new Map(catalog.categories.map((category) => [category.id, category]));
  const gaps = [];
  const assetEntries = await Promise.all(
    templates.templates.map((entry) => syncEntryAssets(entry, gaps))
  );
  const assetMap = new Map(assetEntries.map((entry) => [entry.id, entry]));

  const entries = templates.templates.map((entry) => ({
    ...entry,
    category_data: categoryMap.get(entry.category) || null,
    site_assets: assetMap.get(entry.id) || null,
  }));

  const siteData = {
    generated_at: new Date().toISOString(),
    source: "web/scripts/sync-registry.mjs",
    registry_generated_at: catalog.generated_at,
    summary: catalog.summary,
    categories: catalog.categories,
    entries,
    featured_entries: entries.filter((entry) => entry.featured),
    filter_options: catalog.filter_options,
    routes: catalog.routes,
    asset_manifest: assetEntries,
    preview_gaps: gaps,
  };

  await writeJson(path.join(generatedDir, "catalog.json"), catalog);
  await writeJson(path.join(generatedDir, "templates.json"), templates);
  await writeJson(path.join(generatedDir, "site-data.json"), siteData);

  const imagesGenerated = assetEntries.filter((a) => a.preview_image_source === "auto-pdf").length;
  const imagesDeclared = assetEntries.filter((a) => a.preview_image_source === "declared").length;
  console.log(
    `Synced ${entries.length} registry entries. Preview images: ${imagesDeclared} declared, ${imagesGenerated} auto-rendered from PDF, ${gaps.length} gaps.`
  );
  if (gaps.length) {
    for (const gap of gaps) {
      console.log(`  · gap: ${gap.slug} — ${gap.reason}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
