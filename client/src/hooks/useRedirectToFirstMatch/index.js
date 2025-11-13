import { useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Authorization from "helpers/authorization";
import lh from "helpers/linkHandler";
import useAuthentication from "../useAuthentication";

export default function useRedirectToFirstMatch({
  route,
  id,
  slug,
  candidates,
  state
}) {
  const authentication = useAuthentication();
  const { pathname } = useLocation();

  const maybeRedirect = useCallback(() => {
    const basePathname = lh.link(route);
    const idPathname = lh.link(route, id);
    const idPathnameFlat = idPathname.replace(/\/$/, "");
    const slugPathname = lh.link(route, slug);
    const slugPathnameFlat = slugPathname.replace(/\/$/, "");

    if (
      pathname !== basePathname &&
      pathname !== idPathname &&
      pathname !== idPathnameFlat &&
      pathname !== slugPathname &&
      pathname !== slugPathnameFlat
    )
      return;

    const authorization = new Authorization();

    candidates.every(candidate => {
      if (
        !candidate.ability ||
        authorization.authorize({ ...candidate, authentication })
      ) {
        if (candidate.path) {
          // history.replace(candidate.path, state);
          return false;
        } else if (candidate.hasOwnProperty("route")) {
          const args = candidate.args || [];
          // history.replace(lh.link(candidate.route, ...args), state);
          return false;
        }
      }
      return true;
    });
  }, [route, slug, id, state, candidates, pathname, authentication]);

  useEffect(() => {
    if (route) maybeRedirect();
  }, [maybeRedirect, route]);
}
