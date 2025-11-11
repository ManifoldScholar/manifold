import { redirect } from "react-router-dom";
import { getStore } from "store/storeInstance";
import { grab } from "utils/entityUtils";

/**
 * Loader utility to check if library mode is disabled.
 * If disabled, redirects to the appropriate URL (home redirect or library redirect).
 *
 * Works with both SSR (store from context) and client-side (store from storeInstance).
 *
 * @param {Object} loaderArgs - Loader arguments from React Router
 * @param {Object} loaderArgs.request - Request object
 * @param {Object} loaderArgs.context - Loader context (contains context.store for SSR)
 * @returns {null} Returns null if library mode is enabled (allows route to render)
 * @throws {Response} Throws redirect Response if library mode is disabled
 */
export default function checkLibraryMode({ request, context }) {
  const store = context?.store || getStore();
  const state = store.getState();

  // Get settings from store (loaded during bootstrap)
  const settings = grab("settings", "0", state.entityStore);

  if (!settings) {
    return null; // Settings not loaded yet, let component handle it
  }

  const libraryDisabled = settings.attributes?.general?.libraryDisabled;
  if (!libraryDisabled) {
    return null;
  }

  const url = new URL(request.url);
  const isHome = url.pathname === "/";
  const { general } = settings.attributes;

  const redirectUrl =
    isHome && general.homeRedirectUrl
      ? general.homeRedirectUrl
      : general.libraryRedirectUrl;

  if (!redirectUrl) {
    // No redirect URL configured, let component handle it
    return null;
  }

  throw redirect(redirectUrl);
}
