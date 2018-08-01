import React, { Component } from "react";
import PropTypes from "prop-types";
import { HigherOrder } from "containers/global";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router-dom";

export class NavigationSecondary extends Component {
  static displayName = "Navigation.Secondary";

  static propTypes = {
    links: PropTypes.array,
    location: PropTypes.object
  };

  renderItem(link) {
    return (
      <li key={link.key}>
        <NavLink to={link.path} activeClassName="active">
          {link.label}
        </NavLink>
      </li>
    );
  }

  render() {
    return (
      <HigherOrder.BlurOnLocationChange location={this.props.location}>
        <nav className="panel-nav">
          <ul>
            {this.props.links.map(link => {
              if (link.ability)
                return (
                  <HigherOrder.Authorize
                    key={`${link.key}-wrapped`}
                    entity={link.entity}
                    ability={link.ability}
                  >
                    {this.renderItem(link)}
                  </HigherOrder.Authorize>
                );
              return this.renderItem(link);
            })}
          </ul>
        </nav>
      </HigherOrder.BlurOnLocationChange>
    );
  }
}

export default withRouter(NavigationSecondary);
