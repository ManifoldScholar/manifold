import React from "react";
import PropTypes from "prop-types";
import { withRouter, matchPath } from "react-router-dom";
import NotFound from "global/containers/NotFound";

/**
 * The public API for rendering the first <Route> that matches.
 */
class ChildSwitch extends React.Component {
  static propTypes = {
    parentRoute: PropTypes.object,
    children: PropTypes.node,
    location: PropTypes.object,
    match: PropTypes.object
  };

  render() {
    const location = this.props.location;
    let element;
    let match;

    // We use React.Children.forEach instead of React.Children.toArray().find()
    // here because toArray adds keys to all child elements and we do not want
    // to trigger an unmount/remount for two <Route>s that render the same
    // component at different URLs.
    React.Children.forEach(this.props.children, child => {
      if (match == null && React.isValidElement(child)) {
        element = child;

        const path = child.props.path || child.props.from;

        match = path
          ? matchPath(location.pathname, { ...child.props, path })
          : this.props.match;
      }
    });

    // The childSwitch needs the location to match one of the child routes, or it needs
    // to exactly match the parent route. If neither of these conditions are met, it will
    // render a 404.
    const parentCompare = { ...this.props.parentRoute, exact: true };
    const parentMatch = matchPath(location.pathname, parentCompare);
    if (!match && !parentMatch) return <NotFound />;

    return match
      ? React.cloneElement(element, { location, computedMatch: match })
      : null;
  }
}

export default withRouter(ChildSwitch);
