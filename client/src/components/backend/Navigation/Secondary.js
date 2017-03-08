import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class NavigationSecondary extends Component {

  static displayName = "Navigation.Secondary";

  static propTypes = {
    links: PropTypes.array,
    active: PropTypes.string
  };

  render() {
    const active = this.props.active;

    return (
      <nav className="panel-nav">
        <ul>
          {this.props.links.map((link) => {
            return (
              <li key={link.key} >
                <Link
                  to={link.path}
                  className={active === link.key ? 'active' : ''}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}
