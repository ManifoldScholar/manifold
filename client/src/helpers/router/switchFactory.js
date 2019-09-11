import React from "react";
import PropTypes from "prop-types";
import hoistStatics from "hoist-non-react-statics";
import { withRouter, matchPath } from "react-router-dom";

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default function switchFactory(Wrapper) {
  const displayName = `Router.Switch('${getDisplayName(Wrapper)})`;

  class RouterSwitch extends React.PureComponent {
    static Wrapper = Wrapper;

    static displayName = displayName;

    static propTypes = {
      location: PropTypes.object.isRequired,
      children: PropTypes.any,
      match: PropTypes.object,
      history: PropTypes.object,
      staticContext: PropTypes.object
    };

    match() {
      const route = this.props.match;
      const { children } = this.props;
      const location = this.props.location || route.location;
      let match;
      let child;
      React.Children.forEach(children, element => {
        if (match == null && React.isValidElement(element)) {
          const {
            path: pathProp,
            exact,
            strict,
            sensitive,
            from
          } = element.props;
          const path = pathProp || from;

          child = element;
          match = path
            ? matchPath(location.pathname, { path, exact, strict, sensitive })
            : route.match;
        }
      });
      return { location, match, child };
    }

    wrapperProps() {
      const {
        location,
        match,
        history,
        children,
        staticContext,
        ...wrapperProps
      } = this.props;
      return wrapperProps;
    }

    render() {
      const { location, match, child } = this.match();
      const children = match
        ? React.cloneElement(child, { location, computedMatch: match })
        : null;
      const props = {
        ...this.props,
        match,
        children,
        wrapperProps: this.wrapperProps()
      };
      return React.createElement(Wrapper, props);
    }
  }

  return hoistStatics(withRouter(RouterSwitch), Wrapper);
}
