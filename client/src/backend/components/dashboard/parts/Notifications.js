import React, { Component } from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";

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
            <button className="notification-list-block__close-button">
              <IconComposer icon="close16" size="default" />
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
            <button className="notification-list-block__close-button">
              <IconComposer icon="close16" size="default" />
              <span className="screen-reader-text">Close Notification</span>
            </button>
          </li>
        </ul>
        <a
          href="https://en.wikipedia.org/wiki/Placeholder"
          className="utility-button"
        >
          <span className="utility-button__text utility-button__text--highlight">
            {"Notification History"}
          </span>
        </a>
      </nav>
    );
  }
}
