import { redirect, data } from "react-router";
import Authorization from "helpers/authorization";
import lh from "helpers/linkHandler";
import { routerContext } from "app/contexts";

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
 * @param {Object} options.context - Router context (from middleware)
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
  failureMessage,
  currentPath
}) {
  // Get user from middleware context
  const { auth } = context.get(routerContext) ?? {};
  const currentUser = auth?.user;
  const isAuthenticated = !!currentUser;

  // Build authentication object for Authorization class
  const authentication = {
    authenticated: isAuthenticated,
    currentUser
  };

  const isAuthorized = authorization.authorize({
    authentication,
    ability,
    kind,
    entity
  });

  if (!isAuthorized && isAuthenticated) {
    const hasAnyAdminAccess = authorization.authorizeKind({
      authentication,
      kind: [
        "admin",
        "editor",
        "marketeer",
        "project_creator",
        "project_editor",
        "project_property_manager",
        "journal_editor"
      ]
    });

    throw data(
      {
        method: "GET",
        heading: "Access Denied",
        userMessage:
          failureMessage ??
          (!hasAnyAdminAccess
            ? "errors.access_denied.no_admin_access"
            : "errors.access_denied.authorization_admin"),
        contained: true,
        hideStatus: true
      },
      {
        status: 403
      }
    );
  }

  if (!isAuthorized && failureRedirect) {
    const loginPath = lh.link("frontendLogin");
    const redirectPath = getRedirectPath(failureRedirect, currentPath);
    const redirectUri =
      redirectPath && redirectPath !== loginPath ? redirectPath : currentPath;
    const redirectUrl = redirectUri
      ? `${loginPath}?redirect_uri=${encodeURIComponent(redirectUri)}`
      : loginPath;

    throw redirect(redirectUrl);
  }

  if (!isAuthorized) {
    throw new Response(null, {
      status: 403,
      statusText: "Forbidden"
    });
  }

  return null;
}
