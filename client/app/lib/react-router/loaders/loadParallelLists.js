import { queryApi } from "api";

/**
 * Loads multiple lists in parallel, gracefully handling partial failures.
 * Each key always resolves to { data, meta }, even on failure (data: [],
 * meta: null), so callers don't need to defend against undefined. Callers that
 * don't care about pagination just read `.data`; callers that need to drive
 * eager loading or render pagination read `.meta`.
 *
 * @param {Object} params
 * @param {Object} params.context - Router context
 * @param {Object} params.fetchFns - Object mapping keys to fetch functions
 * @returns {Object} { [key]: { data, meta } }
 */
export default async function loadParallelLists({ context, fetchFns }) {
  const keys = Object.keys(fetchFns);
  const promises = keys.map(key => queryApi(fetchFns[key](), context));

  const results = await Promise.allSettled(promises);

  const output = {};
  keys.forEach((key, index) => {
    const result = results[index];
    if (result.status === "fulfilled") {
      output[key] = {
        data: result.value?.data ?? [],
        meta: result.value?.meta ?? null
      };
    } else {
      // Log errors for debugging, but don't throw (graceful degradation)
      console.error(
        `[loadParallelLists] Failed to load ${key}:`,
        result.reason
      );
      output[key] = { data: [], meta: null };
    }
  });

  return output;
}
