import { getStore } from "store/storeInstance";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";

/**
 * Fetches data in a route loader.
 * Integrates with Redux entity store for consistency with useFetch.
 *
 * @param {Object} options
 * @param {Array} options.request - [apiFunction, ...args]
 * @param {Object} options.context - Loader context (contains context.store for SSR)
 * @param {string} options.requestKey - Request key for entity store (optional, will be generated if not provided)
 * @returns {Promise<Object>} Object with requestKey: { requestKey: string }
 */
export default async function dataLoader({ request, context, requestKey }) {
  const store = context?.store || getStore();
  const [apiFunction, ...apiCallArgs] = request;

  // If requestKey is provided, check for existing data
  if (requestKey) {
    const state = store.getState();
    const existingData = select(requestKey, state.entityStore);
    if (existingData) {
      return { requestKey };
    }
  }

  const apiCall = apiFunction(...apiCallArgs);
  const action = entityStoreActions.request(apiCall, requestKey);
  const { promise, meta } = store.dispatch(action);
  await promise;

  // Return the requestKey (either provided or generated from meta)
  return { requestKey: requestKey || meta };
}
