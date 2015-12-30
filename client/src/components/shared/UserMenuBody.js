import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

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
    return (
        <nav className="user-menu">
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

