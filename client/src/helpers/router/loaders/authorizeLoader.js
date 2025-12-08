import { redirect } from "react-router";
import { getStore } from "store/storeInstance";
import Authorization from "helpers/authorization";
import lh from "helpers/linkHandler";

const authorization = new Authorization();

function getRedirectPath(redirectProp, currentPath) {
  if (redirectProp === true) {
    const pathKey = currentPath.split("/")?.[1];
    const availableRedirects = [
      "projects/all",
      "backend/dashboard",
      "journals/all",
      "groups"
    ];
    return pathKey
      ? `/${availableRedirects.find(r => r.startsWith(pathKey))}`
      : "/";
  }

  if (typeof redirectProp === "string") return redirectProp;

  return null;
}

/**
 * Checks authorization in a route loader.
 * Throws redirect if unauthorized.
 *
 * @param {Object} options
 * @param {Object} options.context - Loader context (contains context.store for SSR)
 * @param {string|Array} options.ability - Ability to check
 * @param {string|Array} options.kind - Kind to check
 * @param {Object|string|Array} options.entity - Entity to check
 * @param {string|boolean} options.failureRedirect - Redirect path if unauthorized
 * @param {string} options.currentPath - Current pathname for redirect_uri
 * @returns {Promise<null>} Returns null if authorized
 * @throws {Response} Throws redirect Response if unauthorized
 */
export default async function authorizeLoader({
  context,
  ability,
  kind,
  entity,
  failureRedirect,
  currentPath
}) {
  const store = context?.store || getStore();
  const state = store.getState();
  const authentication = state.authentication;

  const isAuthorized = authorization.authorize({
    authentication,
    ability,
    kind,
    entity
  });

  if (!isAuthorized && failureRedirect) {
    const loginPath = lh.link("frontendLogin");
    const redirectPath = getRedirectPath(failureRedirect, currentPath);
    // If redirectPath is not login, use it as redirect_uri destination
    const redirectUri =
      redirectPath && redirectPath !== loginPath ? redirectPath : currentPath;
    const redirectUrl = redirectUri
      ? `${loginPath}?redirect_uri=${encodeURIComponent(redirectUri)}`
      : loginPath;

    throw redirect(redirectUrl);
  }

  if (!isAuthorized) {
    // No redirect specified, throw 403 error
    throw new Response(null, {
      status: 403,
      statusText: "Forbidden"
    });
  }

  return null;
}
