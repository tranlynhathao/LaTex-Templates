import { defineConfig } from "astro/config";

function normalizeBasePath(value) {
  if (!value || value === "/") {
    return "/";
  }

  const trimmed = value.replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}/` : "/";
}

export default defineConfig({
  site: process.env.SITE_URL || "http://localhost:4321",
  base: normalizeBasePath(process.env.BASE_PATH || "/"),
  output: "static",
  trailingSlash: "ignore",
});
