import { searchResultsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleLoaderError from "app/routes/utility/helpers/handleLoaderError";
import { hasSearchableQuery, parseQueryFromUrl } from "hooks/useSearch/helpers";

/**
 * Loader for search routes. Handles parsing query params, fetching search results,
 * and returning formatted data.
 *
 * @param {Object} options - Configuration options
 * @param {Object} options.request - React Router request object
 * @param {Object} options.context - React Router context object
 * @param {Function} options.beforeQuery - Optional function to modify searchQueryState before processing
 * @param {Function} options.beforeLoad - Optional async function to run before processing (e.g., checkLibraryMode)
 * @returns {Promise<Object>} Object with results, meta, and optionally searchQueryState
 */
export default async function searchLoader({
  request,
  context,
  beforeQuery = null,
  beforeLoad = null
}) {
  if (beforeLoad) {
    await beforeLoad({ request, context });
  }

  const url = new URL(request.url);
  const searchQueryState = parseQueryFromUrl(url.search);

  // Allow modification of query state (e.g., adding project ID)
  if (beforeQuery) {
    beforeQuery(searchQueryState);
  }

  if (!hasSearchableQuery(searchQueryState)) {
    return {
      results: null,
      meta: null
    };
  }

  const pagination = { number: searchQueryState.page || 1 };
  const query = { ...searchQueryState };
  query.page = pagination;

  try {
    const response = await queryApi(searchResultsAPI.index(query), context);

    return {
      results: response?.data ?? null,
      meta: response?.meta ?? null
    };
  } catch (error) {
    handleLoaderError(error);
  }
}
