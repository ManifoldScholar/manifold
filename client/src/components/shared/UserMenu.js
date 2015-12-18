import React, { Component, PropTypes } from 'react';
import { UserMenuButton } from './';
import { Link } from 'react-router';
import classNames from 'classnames';

export default class UserButton extends Component {

  static propTypes = {
    toggleUserMenu: PropTypes.func,
    showLoginOverlay: PropTypes.func,
    startLogout: PropTypes.func,
    authenticated: PropTypes.bool,
    visible: PropTypes.bool
  };

  render = () => {
    const menuClass = classNames({
      'user-menu': true,
      'menu-hidden': !this.props.visible,
      'menu-visible': this.props.visible
    });
    return (
        <div className="container-user-menu">
          <UserMenuButton
              toggleUserMenu={this.props.toggleUserMenu}
              showLoginOverlay={this.props.showLoginOverlay}
              authenticated={this.props.authenticated}
              menuVisible={this.props.visible}
          />
          <nav className={menuClass}>
            <ul>
              <li>
                <Link to="#">
                  <i className="manicon manicon-person-pencil"></i>
                  {'Edit Profile'}
                </Link>
              </li>
              <li>
                <button onClick={this.props.startLogout}>
                  <i className="manicon manicon-circle-arrow-out-right"></i>
                  {'Logout'}
                </button>
              </li>
            </ul>
          </nav>
        </div>
    );
  };
}

