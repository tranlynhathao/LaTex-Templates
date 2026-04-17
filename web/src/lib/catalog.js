import siteData from "../generated/site-data.json";

function sortCategories(left, right) {
  return (left.sort_order || 0) - (right.sort_order || 0) || left.name.localeCompare(right.name);
}

function sortEntries(left, right) {
  const leftSort = left.catalog?.sort || {};
  const rightSort = right.catalog?.sort || {};

  return (
    (leftSort.category_order || 0) - (rightSort.category_order || 0) ||
    (leftSort.entry_order || 0) - (rightSort.entry_order || 0) ||
    (leftSort.featured_rank || 0) - (rightSort.featured_rank || 0) ||
    left.name.localeCompare(right.name)
  );
}

const entries = [...siteData.entries]
  .filter((entry) => entry.listing_visibility === "public")
  .sort(sortEntries);
const categories = [...siteData.categories]
  .filter((category) => category.listing_visibility === "public")
  .sort(sortCategories);

const entryBySlug = new Map(entries.map((entry) => [entry.slug, entry]));
const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));

export function getSiteData() {
  return siteData;
}

export function getEntries() {
  return entries;
}

export function getFeaturedEntries() {
  return entries.filter((entry) => entry.featured);
}

export function getEntryBySlug(slug) {
  return entryBySlug.get(slug);
}

export function getCategories() {
  return categories;
}

export function getCategoryBySlug(slug) {
  return categoryBySlug.get(slug);
}

export function getEntriesByCategory(categoryId) {
  return entries.filter((entry) => entry.category === categoryId);
}

export function getFilterOptions() {
  return siteData.filter_options;
}

export function getBootstrapEntry(category) {
  if (!category?.bootstrap_source) {
    return null;
  }

  return entries.find((entry) => entry.template_root === category.bootstrap_source) || null;
}

export function getRelatedEntries(entry, limit = 3) {
  return entries
    .filter((candidate) => {
      if (candidate.id === entry.id) {
        return false;
      }

      return (
        candidate.category === entry.category ||
        (entry.family && candidate.family && candidate.family === entry.family)
      );
    })
    .slice(0, limit);
}
