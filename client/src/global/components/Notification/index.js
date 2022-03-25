import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";

class Notification extends Component {
  static propTypes = {
    id: PropTypes.string,
    heading: PropTypes.string,
    body: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    level: PropTypes.number,
    removeNotification: PropTypes.func,
    style: PropTypes.string,
    t: PropTypes.func
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
      output = <p className="notification__body">{this.props.body}</p>;
    }

    return output;
  }

  render() {
    return (
      <div className={this.wrapperClass} key={this.props.id}>
        <div className="notification__container">
          <div role="status">
            <p className="notification__heading">{this.props.heading}</p>
          </div>
          {this.bodyCopy()}

          <button
            className="notification__button"
            onClick={this.handleClose}
            data-id="close"
          >
            <IconComposer
              icon="close32"
              size={36}
              className="notification__button-icon"
            />
            <span className="screen-reader-text">
              {this.props.t("actions.dismiss")}
            </span>
          </button>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Notification);
