import { redirect } from "react-router-dom";
import lh from "helpers/linkHandler";
import { getStore } from "store/storeInstance";

/**
 * Authentication loader utility for React Router v6 routes.
 * Checks if a user is authenticated and redirects to login if not.
 *
 * @param {Object} loaderContext - Loader context from React Router (contains context.store for SSR)
 * @param {string} currentPath - Current pathname to include as redirect_uri
 * @returns {null} Returns null if authenticated (allows route to render)
 * @throws {Response} Throws redirect Response if not authenticated
 */
export default function requireAuth(loaderContext, currentPath) {
  const store = loaderContext?.store || getStore();
  const state = store.getState();
  const currentUser = state.authentication?.currentUser;

  if (!currentUser) {
    const loginPath = lh.link("frontendLogin");
    const redirectUrl = currentPath
      ? `${loginPath}?redirect_uri=${encodeURIComponent(currentPath)}`
      : loginPath;

    throw redirect(redirectUrl);
  }

  return null;
}
