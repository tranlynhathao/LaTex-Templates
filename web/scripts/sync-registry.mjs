import { access, copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(webRoot, "..");
const registryDir = path.join(repoRoot, "registry");
const generatedDir = path.join(webRoot, "src", "generated");
const siteAssetsDir = path.join(webRoot, "public", "site-assets");

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

async function syncEntryAssets(entry) {
  const assets = {
    id: entry.id,
    slug: entry.slug,
    preview_image_url: null,
    preview_document_url: null,
    download_archive_url: null,
  };

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
    }
  }

  const previewDocumentPath = entry.resolved_paths?.preview_document;
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
    }
  }

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
  const assetEntries = await Promise.all(templates.templates.map(syncEntryAssets));
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
  };

  await writeJson(path.join(generatedDir, "catalog.json"), catalog);
  await writeJson(path.join(generatedDir, "templates.json"), templates);
  await writeJson(path.join(generatedDir, "site-data.json"), siteData);

  console.log(
    `Synced ${entries.length} registry entries into web/src/generated and web/public/site-assets.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
