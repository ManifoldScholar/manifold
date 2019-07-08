import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";

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
        aria-haspopup
        aria-expanded={this.props.active}
      >
        <Utility.IconComposer icon="text24" size={32} />
        <span className="screen-reader-text">{"Reader appearance"}</span>
      </button>
    );
  }
}
