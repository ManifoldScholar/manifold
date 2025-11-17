import { useMemo } from "react";
import hoistStatics from "../hoist-non-react-statics";
import { Navigate, useLocation, useMatches } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFromStore } from "hooks";
import { requests } from "api";
import { fatalErrorActions } from "actions";

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default function redirectIfLibraryDisabled(WrappedComponent) {
  const displayName = `redirectIfLibraryDisabled('${getDisplayName(
    WrappedComponent
  )})`;

  function RedirectIfLibraryDisabled(props) {
    const location = useLocation();
    const matches = useMatches();
    const dispatch = useDispatch();
    const settings = useFromStore({
      requestKey: requests.settings,
      action: "select"
    });

    const libraryModeDisabled = useMemo(() => {
      if (!settings) return false;
      return settings.attributes.general.libraryDisabled;
    }, [settings]);

    const isHome = useMemo(() => {
      return location && location.pathname === "/";
    }, [location]);

    const redirectUrl = useMemo(() => {
      if (!settings) return null;
      const { general } = settings.attributes;
      if (isHome && general.homeRedirectUrl) return general.homeRedirectUrl;
      return general.libraryRedirectUrl;
    }, [settings, isHome]);

    const currentRouteIsLibraryRoute = useMemo(() => {
      // useMatches() returns all matched routes from root to current
      // Check if all matched routes have isLibrary: true in their handle
      // Skip the root Manifold route (index 0) as it's not a frontend route
      return matches.slice(1).every(match => {
        return match.handle?.isLibrary === true;
      });
    }, [matches]);

    if (libraryModeDisabled && currentRouteIsLibraryRoute) {
      if (redirectUrl) {
        // For SSR, throw a Response object for redirect
        if (__SERVER__) {
          throw new Response(null, {
            status: 302,
            headers: { Location: redirectUrl }
          });
        }
        return <Navigate to={redirectUrl} replace />;
      }
      dispatch(fatalErrorActions.trigger404());
    }

    return <WrappedComponent {...props} />;
  }

  RedirectIfLibraryDisabled.WrappedComponent = WrappedComponent;
  RedirectIfLibraryDisabled.displayName = displayName;

  return hoistStatics(RedirectIfLibraryDisabled, WrappedComponent);
}
