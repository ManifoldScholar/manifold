import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";

export default class Notification extends Component {
  static propTypes = {
    id: PropTypes.string,
    heading: PropTypes.string,
    body: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    level: PropTypes.number,
    removeNotification: PropTypes.func
  };

  // Close notification in handler in case event access is required
  handleClose = () => {
    this.props.removeNotification(this.props.id);
  };

  bodyCopy() {
    let output = null;
    if (this.props.body) {
      output = (
        <p className="notification-body" role="status" aria-live="polite">
          {this.props.body}
        </p>
      );
    }

    return output;
  }

  render() {
    const notificationClass = classNames({
      notification: true,
      notice: this.props.level === 0,
      warning: this.props.level === 1,
      error: this.props.level === 2
    });

    return (
      <div className={notificationClass} key={this.props.id}>
        <div className="container">
          <header role="status" aria-live="polite" aria-atomic="true">
            <h5 className="notification-heading">{this.props.heading}</h5>
          </header>
          {this.bodyCopy()}

          <button
            className="notification-close"
            onClick={this.handleClose}
            data-id="close"
          >
            <IconComposer
              icon="close32"
              size={42.667}
              iconClass="notification-close__icon"
            />
            <span className="screen-reader-text">{"Dismiss"}</span>
          </button>
        </div>
      </div>
    );
  }
}
