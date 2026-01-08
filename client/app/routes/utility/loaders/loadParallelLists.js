import { queryApi } from "app/routes/utility/helpers/queryApi";

/**
 * Loads multiple lists in parallel, gracefully handling partial failures.
 * Failed requests are silently ignored (returns undefined for that key).
 * This is useful for optional parallel data where one failure shouldn't block others.
 *
 * @param {Object} params
 * @param {Object} params.context - Router context
 * @param {Object} params.fetchFns - Object mapping keys to fetch functions
 * @returns {Object} Object with same keys as fetchFns, values are data arrays or undefined if failed
 */
export default async function loadParallelLists({ context, fetchFns }) {
  const keys = Object.keys(fetchFns);
  const promises = keys.map(key => queryApi(fetchFns[key](), context));

  const results = await Promise.allSettled(promises);

  const output = {};
  keys.forEach((key, index) => {
    const result = results[index];
    if (result.status === "fulfilled") {
      output[key] = result.value?.data;
    } else {
      // Log errors for debugging, but don't throw (graceful degradation)
      console.error(
        `[loadParallelLists] Failed to load ${key}:`,
        result.reason
      );
    }
  });

  return output;
}
