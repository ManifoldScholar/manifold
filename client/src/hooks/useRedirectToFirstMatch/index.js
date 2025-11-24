import { useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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

    // Find first matching candidate (don't navigate yet)
    const matchingCandidate = candidates.find(candidate => {
      if (
        !candidate.ability ||
        authorization.authorize({ ...candidate, authentication })
      ) {
        return true; // Found a match
      }
      return false;
    });

    // Navigate once if we found a match
    if (matchingCandidate) {
      if (matchingCandidate.path) {
        navigate(matchingCandidate.path, { replace: true, state });
      } else if (matchingCandidate.hasOwnProperty("route")) {
        const args = matchingCandidate.args || [];
        navigate(lh.link(matchingCandidate.route, ...args), {
          replace: true,
          state
        });
      }
    }
  }, [route, slug, id, state, candidates, pathname, authentication, navigate]);

  useEffect(() => {
    if (route) maybeRedirect();
  }, [maybeRedirect, route]);
}
