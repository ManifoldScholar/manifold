import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleLoaderError from "app/routes/utility/helpers/handleLoaderError";
import parseListParams from "./parseListParams";

/**
 * Creates a clientLoader for list routes with filters and pagination.
 *
 * @param {Object} config
 * @param {string} config.hydrateKey - Unique key for window hydration flag
 * @param {Function} config.fetchFn - Function to fetch data: (filters, pagination) => Promise<data>
 * @param {Object} config.options - Options to pass to parseListParams (includes defaultFilters, paginationKeys, etc.)
 * @returns {Function} clientLoader function with hydrate = true
 */
export default function createListClientLoader({
  hydrateKey,
  fetchFn,
  options = {}
}) {
  const clientLoader = async ({ request, serverLoader }) => {
    try {
      const url = new URL(request.url);
      const { filters, pagination } = parseListParams(url, options);

      // On initial hydration, use server data
      if (!window[hydrateKey]) {
        window[hydrateKey] = true;
        return serverLoader();
      }

      // After hydration, always fetch client-side (including revalidation)
      // This avoids refetching server data unnecessarily
      const result = await queryApi(fetchFn(filters, pagination));
      return { data: result.data ?? [], meta: result.meta ?? null };
    } catch (error) {
      handleLoaderError(error);
    }
  };

  clientLoader.hydrate = true;
  return clientLoader;
}
