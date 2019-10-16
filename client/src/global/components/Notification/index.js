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
    removeNotification: PropTypes.func,
    style: PropTypes.string
  };

  // Close notification in handler in case event access is required
  handleClose = () => {
    this.props.removeNotification(this.props.id);
  };

  get wrapperClass() {
    return classNames({
      notification: true,
      "notification--notice": this.props.level === 0,
      "notification--warning": this.props.level === 1,
      "notification--error": this.props.level === 2,
      "notification--context-drawer": this.props.style === "drawer",
      "notification--context-header": this.props.style === "header"
    });
  }

  bodyCopy() {
    let output = null;
    if (this.props.body) {
      output = (
        <p className="notification__body" role="status" aria-live="polite">
          {this.props.body}
        </p>
      );
    }

    return output;
  }

  render() {
    return (
      <div className={this.wrapperClass} key={this.props.id}>
        <div className="notification__container">
          <header role="status" aria-live="polite" aria-atomic="true">
            <h5 className="notification__heading">{this.props.heading}</h5>
          </header>
          {this.bodyCopy()}

          <button
            className="notification__button"
            onClick={this.handleClose}
            data-id="close"
          >
            <IconComposer
              icon="close32"
              size={36}
              iconClass="notification__button-icon"
            />
            <span className="screen-reader-text">{"Dismiss"}</span>
          </button>
        </div>
      </div>
    );
  }
}
