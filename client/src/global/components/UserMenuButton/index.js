import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import get from "lodash/get";
import Avatar from "global/components/avatar";

export default class UserMenuButton extends Component {
  static propTypes = {
    authentication: PropTypes.object,
    active: PropTypes.bool,
    toggleUserMenu: PropTypes.func,
    showLoginOverlay: PropTypes.func,
    className: PropTypes.string,
    context: PropTypes.oneOf(["frontend", "backend", "reader"])
  };

  static defaultProps = {
    context: "frontend"
  };

  clickHandler = event => {
    event.stopPropagation();
    if (this.props.authentication.authenticated) {
      this.props.toggleUserMenu();
    } else {
      this.props.showLoginOverlay();
    }
  };

  render() {
    const buttonClass = classNames(this.props.className, {
      "button-avatar": true,
      [`button-avatar--${this.props.context}`]: true,
      "button-active": this.props.active
    });
    return (
      <button
        onClick={this.clickHandler}
        className={buttonClass}
        aria-haspopup
        aria-expanded={this.props.active}
      >
        <span className="screen-reader-text">{"User settings"}</span>
        <Avatar
          url={get(
            this.props.authentication,
            "currentUser.attributes.avatarStyles.smallSquare"
          )}
          iconSize={24}
          ariaHidden
        />
      </button>
    );
  }
}
