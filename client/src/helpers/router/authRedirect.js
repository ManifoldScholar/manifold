import lh from "helpers/linkHandler";

/**
 * Resolves the client path to navigate to after authentication.
 *
 * Shared by the /oauth container and the account-linking success paths, where
 * the API returns the same query string in `meta.redirect`.
 *
 * @param {string|URLSearchParams|null|undefined} query - A query string (with
 *   or without a leading "?"), a URLSearchParams instance, or nothing.
 * @returns {string} The path to redirect to.
 */
export function resolveAuthRedirect(query) {
  const params =
    query instanceof URLSearchParams ? query : new URLSearchParams(query || "");

  const redirectPath = params.get("redirect_path");
  if (redirectPath) return redirectPath;

  const entityType = params.get("redirect_type");
  const entitySlug = params.get("redirect_id");
  const parent = params.get("parent");

  switch (entityType) {
    case "Journal":
      return lh.link("frontendJournal", entitySlug);
    case "Project":
      return lh.link("frontendProject", entitySlug);
    case "ProjectCollection":
      return lh.link("frontendProjectCollection", entitySlug);
    case "Text":
      return lh.link("reader", entitySlug);
    case "TextSection":
      return lh.link("readerSection", parent, entitySlug);
    case "Resource":
      return lh.link("frontendProjectResource", parent, entitySlug);
    case "ResourceCollection":
      return lh.link("frontendProjectResourceCollection", parent, entitySlug);
    default:
      return lh.link("frontend");
  }
}
