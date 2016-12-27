import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class UserListNavigation extends Component {

  static displayName = "Users.Panel.Navigation";

  static propTypes = {
    active: PropTypes.string,
  };

  render() {
    const active = this.props.active;

    return (
      <nav className="panel-nav">
        <ul>
          <li>
            <Link
              to="#"
              className={active === 'users' ? 'active' : ''}
            >
              {'Users'}
            </Link>
          </li>
          <li>
            <Link
              to="#"
              className={active === 'roles' ? 'active' : ''}
            >
              {'Roles'}
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
}
