/**
 * Creates a clientLoader for list routes with filters and pagination.
 *
 * @param {string} hydrateKey - Unique key for window hydration flag
 * @param {Function} fetchFn - Function to fetch data: (filters, pagination) => Promise<data>
 * @param {Function} parseParams - Function to parse URL params: (url) => { filters, pagination }
 * @returns {Function} clientLoader function with hydrate = true
 */
export default function createListClientLoader(
  hydrateKey,
  fetchFn,
  parseParams
) {
  const clientLoader = async ({ request, serverLoader }) => {
    const url = new URL(request.url);
    const { filters, pagination } = parseParams(url);

    // On initial hydration, use server data
    if (!window[hydrateKey]) {
      window[hydrateKey] = true;
      return serverLoader();
    }

    // If URL hasn't changed, this is a revalidation (login/logout)
    // Use serverLoader to get fresh data with current auth state
    if (window.location.href === request.url) {
      return serverLoader();
    }

    // Client-side fetch for filter/pagination changes
    return fetchFn(filters, pagination);
  };

  clientLoader.hydrate = true;
  return clientLoader;
}
