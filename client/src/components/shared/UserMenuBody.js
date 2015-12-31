import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

export default class UserButton extends Component {

  static propTypes = {
    hideUserMenu: PropTypes.func,
    startLogout: PropTypes.func,
    visible: PropTypes.bool
  };

  logout = () => {
    this.props.startLogout();
    this.props.hideUserMenu();
  };

  render = () => {
    const menuClass = classNames({
      'user-menu': true,
      'menu-hidden': !this.props.visible,
      'menu-visible': this.props.visible
    });
    return (
        <nav className={menuClass}>
          <i className="tail"></i>
          <ul>
            <li>
              <Link to="#">
                <i className="manicon manicon-person-pencil"></i>
                {'Edit Profile'}
              </Link>
            </li>
            <li>
              <button onClick={this.logout}>
                <i className="manicon manicon-circle-arrow-out-right"></i>
                {'Logout'}
              </button>
            </li>
          </ul>
        </nav>
    );
  };
}

