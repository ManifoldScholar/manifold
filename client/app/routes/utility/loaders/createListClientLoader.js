import { getApiClient } from "app/routes/utility/helpers/getApiClient";
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
    const url = new URL(request.url);
    const { filters, pagination } = parseListParams(url, options);

    // On initial hydration, use server data
    if (!window[hydrateKey]) {
      window[hydrateKey] = true;
      return serverLoader();
    }

    // After hydration, always fetch client-side (including revalidation)
    // This avoids refetching server data unnecessarily
    const client = getApiClient();

    const result = await client.call(fetchFn(filters, pagination));
    return { data: result.data ?? [], meta: result.meta ?? null };
  };

  clientLoader.hydrate = true;
  return clientLoader;
}
