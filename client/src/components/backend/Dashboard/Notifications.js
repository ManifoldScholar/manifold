import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class Notifications extends Component {

  static displayName = "Dashboard.Notifications";

  static propTypes = {};

  render() {
    return (
      <nav className="notification-list-block">
        <ul>
          <li>
            <p>
              {' Notifications are still a '}
              <a href="https://en.wikipedia.org/wiki/Democracy_in_America">
                {'work in progress!'}
              </a>
            </p>
            <button className="manicon manicon-x"></button>
          </li>
          <li>
            <p>
              {'For now, these are just '}
              <a href="https://en.wikipedia.org/wiki/Placeholder">
                {'placeholders'}
              </a>
            </p>
            <button className="manicon manicon-x"></button>
          </li>
        </ul>
        <Link to="#" className="button-bare-primary">
          {'Notification History'}
        </Link>
      </nav>
    );
  }
}
