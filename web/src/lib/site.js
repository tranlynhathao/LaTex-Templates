export const SITE_NAME = "LaTeX Template Gallery";
export const SITE_TAGLINE =
  "A static catalog for preserved LaTeX templates, reusable scaffolds, and future document families.";

export function withBase(pathname = "/") {
  const base = import.meta.env.BASE_URL || "/";
  const basePrefix = base === "/" ? "" : base.replace(/\/$/, "");
  const normalizedPath =
    pathname === "/" ? "" : pathname.startsWith("/") ? pathname : `/${pathname}`;

  return `${basePrefix}${normalizedPath || "/"}` || "/";
}

export const repositoryUrl = import.meta.env.PUBLIC_REPOSITORY_URL || "";
export const repositoryRef = import.meta.env.PUBLIC_REPOSITORY_REF || "main";

export function getRepositoryTreeUrl(relativePath) {
  return repositoryUrl ? `${repositoryUrl}/tree/${repositoryRef}/${relativePath}` : null;
}

export function getRepositoryBlobUrl(relativePath) {
  return repositoryUrl ? `${repositoryUrl}/blob/${repositoryRef}/${relativePath}` : null;
}

export function getCategoryStateLabel(state) {
  const labels = {
    "real-templates-present": "Real Templates Present",
    "scaffold-backed": "Scaffold Backed",
    "empty-placeholder": "Placeholder Category",
  };

  return labels[state] || state;
}

export function getCategoryStateTone(state) {
  const tones = {
    "real-templates-present": "success",
    "scaffold-backed": "accent",
    "empty-placeholder": "subtle",
  };

  return tones[state] || "subtle";
}
