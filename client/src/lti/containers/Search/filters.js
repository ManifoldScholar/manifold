import { parseQueryFromUrl } from "hooks/useSearch/helpers";

export const ALLOWED_FACETS = [
  "Project",
  "Text",
  "TextSection",
  "ResourceCollection",
  "Resource"
];

export const PRIMARY_FACETS = ["Project", "Text"];

export const SECONDARY_FACETS = [
  "TextSection",
  "ResourceCollection",
  "Resource"
];

export const resolveFacets = search => {
  const hasFacetsParam = new URLSearchParams(search).has("facets");
  const { facets: urlFacets } = parseQueryFromUrl(search);
  const filtered = urlFacets.filter(f => ALLOWED_FACETS.includes(f));
  return hasFacetsParam ? filtered : PRIMARY_FACETS;
};
