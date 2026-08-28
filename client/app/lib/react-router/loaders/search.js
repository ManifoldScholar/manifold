import { searchResultsAPI, queryApi } from "api";
import handleLoaderError from "lib/react-router/helpers/handleLoaderError";
import { hasSearchableQuery, parseQueryFromUrl } from "hooks/search/helpers";

/**
 * Loader for search routes. Parses the search query from the URL (the URL is
 * the source of truth for query state — see hooks/search/useSearch), fetches
 * results, and returns { results, meta } for the route to hand to
 * SearchResultsProvider.
 *
 * @param {Object} options
 * @param {URL} options.url - Normalized request URL from the loader args
 * @param {Object} options.context - React Router context object
 * @param {Object} [options.params] - Extra query fields to merge (e.g. route-scoped project id)
 * @param {Function} [options.beforeLoad] - Optional async hook run first (e.g. checkLibraryMode)
 * @returns {Promise<{results: Array|null, meta: Object|null}>}
 */
export default async function searchLoader({
  url,
  context,
  params = null,
  beforeLoad = null
}) {
  if (beforeLoad) {
    await beforeLoad({ url, context });
  }

  const query = { ...parseQueryFromUrl(url.search), ...params };

  if (!hasSearchableQuery(query)) {
    return { results: null, meta: null };
  }

  const { page, perPage, ...rest } = query;
  const apiQuery = {
    ...rest,
    page: { number: page || 1, size: perPage || 20 }
  };

  try {
    const response = await queryApi(searchResultsAPI.index(apiQuery), context);
    return {
      results: response?.data ?? null,
      meta: response?.meta ?? null
    };
  } catch (error) {
    handleLoaderError(error);
  }
}
