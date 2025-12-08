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
 * @param {string} options.requestKey - Request key for entity store
 * @returns {Promise<Object>} Fetched entity data
 */
export default async function dataLoader({ request, context, requestKey }) {
  const store = context?.store || getStore();
  const [apiFunction, ...apiCallArgs] = request;

  const state = store.getState();
  const existingData = select(requestKey, state.entityStore);
  if (existingData) {
    return existingData;
  }

  const apiCall = apiFunction(...apiCallArgs);
  const action = entityStoreActions.request(apiCall, requestKey);
  const { promise } = store.dispatch(action);
  await promise;

  const newState = store.getState();
  return select(requestKey, newState.entityStore);
}
