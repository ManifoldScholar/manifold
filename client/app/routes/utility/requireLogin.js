import { redirect } from "react-router";
import lh from "helpers/linkHandler";
import { routerContext } from "app/contexts";

/**
 * Checks if a user is authenticated and redirects to login if not.
 */
export default function requireLogin(request, context) {
  const { auth } = context.get(routerContext) ?? {};

  if (!auth?.user) {
    const url = new URL(request.url);
    const loginPath = lh.link("frontendLogin");
    const redirectUrl = url?.pathname
      ? `${loginPath}?redirect_uri=${encodeURIComponent(url.pathname)}`
      : loginPath;

    throw redirect(redirectUrl);
  }

  return null;
}
