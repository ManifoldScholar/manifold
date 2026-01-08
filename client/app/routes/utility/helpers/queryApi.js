import { ApiClient } from "api";
import { routerContext } from "app/contexts";
import cookie from "js-cookie";

/**
 * Makes an API query. Retrieves authToken from context (server) or cookies (client).
 *
 * @param {Function|Object|string} fetchFn - API fetch function or request object
 * @param {Object} context - Optional React Router context
 * @returns {Promise} API response promise
 */
export async function queryApi(fetchFn, context = null) {
  let authToken = null;

  if (context) {
    const { auth } = context.get(routerContext) ?? {};
    authToken = auth?.authToken;
  } else if (typeof window !== "undefined") {
    authToken = cookie.get("authToken");
  }

  const client = new ApiClient(authToken);
  return client.call(fetchFn);
}
