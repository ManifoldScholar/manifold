import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class UserMenuBody extends Component {

  static propTypes = {
    hideUserMenu: PropTypes.func.isRequired,
    startLogout: PropTypes.func.isRequired,
    showLoginOverlay: PropTypes.func.isRequired,
    visible: PropTypes.bool
  };

  constructor() {
    super();
    this.logout = this.logout.bind(this);
    this.handleProfileClick = this.handleProfileClick.bind(this);
  }

  logout() {
    this.props.startLogout();
    this.props.hideUserMenu();
  }

  handleProfileClick(event) {
    event.preventDefault();
    this.props.hideUserMenu();
    this.props.showLoginOverlay();
  }

  render() {
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
            <a href="#" onClick={this.handleProfileClick} >
              <i className="manicon manicon-person-pencil"></i>
              {'Edit Profile'}
            </a>
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
  }
}
