import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Notifications extends Component {
  static displayName = "Dashboard.Notifications";

  static propTypes = {};

  render() {
    return (
      <nav className="notification-list-block">
        <ul>
          <li>
            <p>
              {" Notifications are still a "}
              <a href="https://en.wikipedia.org/wiki/Democracy_in_America">
                {"work in progress!"}
              </a>
            </p>
            <button className="manicon manicon-x">
              <span className="screen-reader-text">Close Notification</span>
            </button>
          </li>
          <li>
            <p>
              {"For now, these are just "}
              <a href="https://en.wikipedia.org/wiki/Placeholder">
                {"placeholders"}
              </a>
            </p>
            <button className="manicon manicon-x">
              <span className="screen-reader-text">Close Notification</span>
            </button>
          </li>
        </ul>
        <a
          href="https://en.wikipedia.org/wiki/Placeholder"
          className="button-bare-primary"
        >
          {"Notification History"}
        </a>
      </nav>
    );
  }
}
