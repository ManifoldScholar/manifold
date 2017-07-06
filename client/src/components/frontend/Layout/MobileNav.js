import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import startsWith from 'lodash/startsWith';
import lh from 'helpers/linkHandler';

export default class MobileNav extends Component {

  static displayName = "Layout.MobileNav";

  static propTypes = {
    location: PropTypes.object
  };

  render() {
    const path = this.props.location.pathname;
    const active = startsWith(path, lh.link("frontendFollowing")) ? 'following' : 'browse';

    return (
      <nav className="footer-fixed">
        <ul className="text-nav">
          <li>
            <Link
              to={lh.link("frontend")}
              className={active === 'browse' ? 'active' : ''}
            >
              Projects
            </Link>
          </li>
          <li>
            <Link
              to={lh.link("frontendFollowing")}
              className={active === 'following' ? 'active' : ''}
            >
              Following
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
}
