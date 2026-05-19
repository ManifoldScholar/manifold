import { searchResultsAPI } from "api";
import { queryApi } from "api";
import handleLoaderError from "lib/react-router/helpers/handleLoaderError";
import { hasSearchableQuery, parseQueryFromUrl } from "hooks/useSearch/helpers";

/**
 * Loader for search routes. Handles parsing query params, fetching search results,
 * and returning formatted data.
 *
 * @param {Object} options - Configuration options
 * @param {Object} options.request - React Router request object
 * @param {Object} options.context - React Router context object
 * @param {Object} options.params - Optional extra fields to merge into query
 * @param {Function} options.beforeLoad - Optional async function to run before processing (e.g., checkLibraryMode)
 * @returns {Promise<Object>} Object with results, meta, and optionally query
 */
export default async function searchLoader({
  request,
  context,
  params = null,
  beforeLoad = null
}) {
  if (beforeLoad) {
    await beforeLoad({ request, context });
  }

  const url = new URL(request.url);
  const query = {
    ...parseQueryFromUrl(url.search),
    ...params
  };

  if (!hasSearchableQuery(query)) {
    return {
      results: null,
      meta: null
    };
  }

  const pagination = {
    number: query.page || 1,
    size: query.perPage || 20
  };
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
