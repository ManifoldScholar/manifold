import { redirect } from "react-router";
import { routerContext } from "app/contexts";

/**
 * Loader utility to check if library mode is disabled.
 * If disabled, redirects to the appropriate URL (home redirect or library redirect).
 *
 * @param {Object} loaderArgs - Loader arguments from React Router
 * @param {Object} loaderArgs.request - Request object
 * @param {Object} loaderArgs.context - Router context (from middleware)
 * @returns {null} Returns null if library mode is enabled (allows route to render)
 * @throws {Response} Throws redirect Response if library mode is disabled
 */
export default function checkLibraryMode({ request, context }) {
  // Get settings from middleware context
  const { settings } = context.get(routerContext) ?? {};

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
    return null;
  }

  throw redirect(redirectUrl);
}
