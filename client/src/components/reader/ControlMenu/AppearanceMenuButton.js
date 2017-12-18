import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class AppearanceMenuButton extends Component {
  static displayName = "ControlMenu.AppearanceMenuButton";

  static propTypes = {
    toggleAppearanceMenu: PropTypes.func,
    active: PropTypes.bool
  };

  clickHandler = event => {
    event.stopPropagation();
    this.props.toggleAppearanceMenu();
  };

  render() {
    const buttonClass = classNames({
      "button-appearance": true,
      "button-active": this.props.active
    });
    return (
      <button
        className={buttonClass}
        onClick={this.clickHandler}
        data-id="toggle-appearance"
      >
        <i className="manicon manicon-aa" />
        <span className="screen-reader-text">
          {"Click to open reader appearance menu"}
        </span>
      </button>
    );
  }
}
