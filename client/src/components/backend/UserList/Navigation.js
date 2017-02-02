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
              to="/backend/people"
              className={active === 'users' ? 'active' : ''}
            >
              {'Users'}
            </Link>
          </li>
          <li>
            <Link
              to="/backend/people/makers"
              className={active === 'makers' ? 'active' : ''}
            >
              {'Makers'}
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
}
