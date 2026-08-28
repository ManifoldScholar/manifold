import { redirect } from "react-router";
import { routerContext } from "app/contexts";

/**
 * Redirects anonymous users to login, preserving the current path as
 * `redirect_uri`. No-op for authenticated users.
 *
 * @param {URL} url - Normalized request URL from the loader args
 * @param {Object} context - Router context (from middleware)
 */
export default function requireLogin(url, context) {
  const { auth } = context.get(routerContext) ?? {};

  if (!auth?.user) {
    const loginPath = "/login";
    const redirectUrl = url?.pathname
      ? `${loginPath}?redirect_uri=${encodeURIComponent(
          `${url.pathname}${url.search}`
        )}`
      : loginPath;

    throw redirect(redirectUrl);
  }

  return null;
}
