import React from "react";
import PropTypes from "prop-types";
import { HigherOrder } from "containers/global";
import { withRouter, matchPath, Redirect } from "react-router-dom";

class RedirectIfNoChildRouteMatches extends React.PureComponent {
  static propTypes = {
    route: PropTypes.object.isRequired,
    to: PropTypes.string.isRequired,
    entity: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
      PropTypes.array
    ]),
    ability: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    kind: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    successBehavior: PropTypes.oneOf(["hide", "show"]).isRequired,
    location: PropTypes.object.isRequired
  };

  static defaultProps = {
    successBehavior: "show"
  };

  shouldRedirect() {
    const match = this.props.route.routes.find(route => {
      return matchPath(this.props.location.pathname, route);
    });
    return match === undefined;
  }

  renderRedirect() {
    if (this.shouldRedirect()) {
      return <Redirect to={this.props.to} />;
    }
    return null;
  }

  render() {
    const {
      route: routeIgnored,
      to: toIgnored,
      ...authorizeProps
    } = this.props;
    if (!this.props.ability) return this.renderRedirect();
    return (
      <HigherOrder.Authorize {...authorizeProps}>
        {this.renderRedirect()}
      </HigherOrder.Authorize>
    );
  }
}

export default withRouter(RedirectIfNoChildRouteMatches);
