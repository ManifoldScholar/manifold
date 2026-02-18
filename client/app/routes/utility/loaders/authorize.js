import { data } from "react-router";
import Authorization from "helpers/authorization";
import { routerContext } from "app/contexts";
import { requireLogin } from "./requireLogin";

const authorization = new Authorization();

/**
 * Checks authorization in a route loader.
 * Throws redirect if unauthorized.
 * Use only for ability checks; loadEntity handles 401/403 returned from api
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
  request,
  context,
  ability,
  kind,
  entity,
  failureMessage
}) {
  await requireLogin(request, context);

  // Get user from middleware context
  const { auth } = context.get(routerContext) ?? {};
  const currentUser = auth?.user;

  // Build authentication object for Authorization class
  const authentication = {
    authenticated: true,
    currentUser
  };

  const isAuthorized = authorization.authorize({
    authentication,
    ability,
    kind,
    entity
  });

  if (!isAuthorized) {
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
        message:
          failureMessage ??
          (!hasAnyAdminAccess
            ? "errors.access_denied.no_admin_access"
            : "errors.access_denied.authorization_admin")
      },
      {
        status: 403
      }
    );
  }

  return null;
}
