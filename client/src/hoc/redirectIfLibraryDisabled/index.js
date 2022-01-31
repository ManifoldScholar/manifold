import React from "react";
import hoistStatics from "hoist-non-react-statics";
import withSettings from "hoc/withSettings";
import { Route } from "react-router-dom";
import frontendRoutes from "frontend/routes";
import { matchRoutes } from "react-router-config";
import { withRouter } from "react-router-dom";
import { fatalErrorActions } from "actions";
import withDispatch from "hoc/withDispatch";

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default function redirectIfLibraryDisabled(WrappedComponent) {
  const displayName = `redirectIfLibraryDisabled('${getDisplayName(
    WrappedComponent
  )})`;

  class RedirectIfLibraryDisabled extends React.PureComponent {
    static WrappedComponent = WrappedComponent;

    static displayName = displayName;

    get settings() {
      return this.props.settings;
    }

    get libraryModeDisabled() {
      if (!this.settings) return false;
      return this.settings.attributes.general.libraryDisabled;
    }

    get isHome() {
      return this.props.location && this.props.location.pathname === "/";
    }

    get redirectUrl() {
      const { general } = this.settings.attributes;
      if (this.isHome && general.homeRedirectUrl)
        return general.homeRedirectUrl;
      return this.settings.attributes.general.libraryRedirectUrl;
    }

    get currentRouteIsLibraryRoute() {
      const pathname = this.props.location.pathname;
      const branch = matchRoutes([frontendRoutes], pathname);
      return branch.every(leaf => {
        return leaf.route.isLibrary === true;
      });
    }

    render() {
      if (this.libraryModeDisabled && this.currentRouteIsLibraryRoute) {
        if (this.redirectUrl)
          return (
            <Route
              render={({ staticContext }) => {
                if (__SERVER__) {
                  staticContext.url = this.redirectUrl;
                } else {
                  window.location = this.redirectUrl;
                }
                return null;
              }}
            />
          );
        this.props.dispatch(fatalErrorActions.trigger404());
      }
      const props = { ...this.props };
      return React.createElement(WrappedComponent, props);
    }
  }

  const Decorated = withSettings(
    withRouter(withDispatch(RedirectIfLibraryDisabled))
  );

  return hoistStatics(Decorated, WrappedComponent);
}
