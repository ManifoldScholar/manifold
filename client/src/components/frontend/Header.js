import React, { Component, PropTypes } from 'react';
import { UserMenu } from '../../components/shared';
import {Link} from 'react-router';

export default class Header extends Component {

  static propTypes = {
    visibility: PropTypes.object,
    location: PropTypes.object,
    authenticated: PropTypes.bool,
    visibilityToggle: PropTypes.func,
    visibilityHide: PropTypes.func,
    visibilityShow: PropTypes.func,
    startLogout: PropTypes.func
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
                {'Projects'}
              </Link>
            </li>
            <li className={this.props.location.pathname === '/browse/following/' ? 'active' : ''}>
              <Link to={`/browse/following/`}>
                {'Following'}
              </Link>
            </li>
          </ul>
        </nav>

        <nav className="widget-nav">
          <UserMenu
              toggleUserMenu={() => {this.props.visibilityToggle('userMenu');}}
              hideUserMenu={()=> {this.props.visibilityHide('userMenu');}}
              showLoginOverlay={() => {this.props.visibilityShow('loginOverlay');}}
              startLogout={this.props.startLogout}
              authenticated={this.props.authenticated}
              visible={this.props.visibility.userMenu}
          />
        </nav>
      </header>
    );
  };
}
