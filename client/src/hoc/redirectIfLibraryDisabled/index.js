import { useMemo } from "react";
import hoistStatics from "../hoist-non-react-statics";
import { Route } from "react-router-dom";
import frontendRoutes from "frontend/routes";
import { matchRoutes } from "react-router-config";
import { useLocation } from "react-router-dom-v5-compat";
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
      const pathname = location.pathname;
      const branch = matchRoutes([frontendRoutes], pathname);
      return branch.every(leaf => {
        return leaf.route.isLibrary === true;
      });
    }, [location.pathname]);

    if (libraryModeDisabled && currentRouteIsLibraryRoute) {
      if (redirectUrl) {
        return (
          <Route
            render={({ staticContext }) => {
              if (__SERVER__) {
                staticContext.url = redirectUrl;
              } else {
                window.location = redirectUrl;
              }
              return null;
            }}
          />
        );
      }
      dispatch(fatalErrorActions.trigger404());
    }

    return <WrappedComponent {...props} />;
  }

  RedirectIfLibraryDisabled.WrappedComponent = WrappedComponent;
  RedirectIfLibraryDisabled.displayName = displayName;

  return hoistStatics(RedirectIfLibraryDisabled, WrappedComponent);
}
