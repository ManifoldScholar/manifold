import React, { Component, PropTypes } from 'react';
import { NavLink } from 'react-router-dom';

export default class NavigationSecondary extends Component {

  static displayName = "Navigation.Secondary";

  static propTypes = {
    links: PropTypes.array
  };

  render() {
    return (
      <nav className="panel-nav">
        <ul>
          {this.props.links.map((link) => {
            return (
              <li key={link.key} >
                <NavLink
                  exact
                  to={link.path}
                  activeClassName="active"
                >
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}
