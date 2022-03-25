import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import classNames from "classnames";
import get from "lodash/get";
import Avatar from "global/components/avatar";

class UserMenuButton extends Component {
  static propTypes = {
    authentication: PropTypes.object,
    active: PropTypes.bool,
    toggleUserMenu: PropTypes.func,
    showLoginOverlay: PropTypes.func,
    className: PropTypes.string,
    context: PropTypes.oneOf(["frontend", "backend", "reader"]),
    t: PropTypes.func
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

  screenReaderText = this.props.authentication?.authenticated
    ? this.props.t("navigation.user.settings")
    : this.props.t("navigation.user.sign_in");

  ariaHasPopup = this.props.authentication?.authenticated ? true : "dialog";

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
        aria-haspopup={this.ariaHasPopup}
        aria-expanded={this.props.active}
      >
        <span className="screen-reader-text">{this.screenReaderText}</span>
        <Avatar
          url={get(
            this.props.authentication,
            "currentUser.attributes.avatarStyles.smallSquare"
          )}
          iconSize={this.props.context === "reader" ? 24 : 64}
          ariaHidden
        />
      </button>
    );
  }
}

export default withTranslation()(UserMenuButton);
