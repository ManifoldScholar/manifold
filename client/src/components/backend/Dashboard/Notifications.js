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
              You have <Link to="#">36 flagged comments</Link> awaiting moderation
            </p>
            <button className="manicon manicon-x"></button>
          </li>
          <li>
            <p>
              You have <Link to="#">417 flagged comments</Link> awaiting moderation
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
