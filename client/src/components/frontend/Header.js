import React, { Component, PropTypes } from 'react';
import { UserMenu } from '../../components/shared';
import {Link} from 'react-router';

export default class Header extends Component {

  static propTypes = {
    showLoginOverlay: PropTypes.func,
    location: PropTypes.object,
    authenticated: PropTypes.bool
  };

  render = () => {
    return (
      <header className={'header-browse'}>
        <Link to={'/browse'} className="logo">
          <figure>
            <i className="manicon manicon-manifold-logo"></i>
            <span className="screen-reader-text">
              {'Manifold Logo: Click to return to the browse page'}
            </span>
          </figure>
        </Link>
        <nav className="text-nav">
          <ul>
            <li className={this.props.location.pathname === '/browse/' ? 'active' : ''}>
              <Link to={`/browse/`}>
                Browse
              </Link>
            </li>
            <li className={this.props.location.pathname === '/browse/following/' ? 'active' : ''}>
              <Link to={`/browse/following/`}>
                Following
              </Link>
            </li>
          </ul>
        </nav>

        <nav className="widget-nav">
          <button className="button-bare-icon button-magnify">
            <i className="manicon manicon-magnify"></i>
            <span className="screen-reader-text">{'Click to search Manifold library'}</span>
          </button>
          <UserMenu showLoginOverlay={this.props.showLoginOverlay}
                      authenticated={this.props.authenticated} />
        </nav>
      </header>
    );
  };
}
