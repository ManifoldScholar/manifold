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
    showLoginOverlay: PropTypes.func
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
    const buttonClass = classNames({
      "button-avatar": true,
      "button-active": this.props.active
    });
    return (
      <button onClick={this.clickHandler} className={buttonClass} type="button">
        <span className="screen-reader-text">
          {"Login or open user settings"}
        </span>
        <Avatar
          url={get(
            this.props.authentication,
            "currentUser.attributes.avatarStyles.smallSquare"
          )}
        />
      </button>
    );
  }
}
