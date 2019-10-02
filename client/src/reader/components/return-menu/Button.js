import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class ReturnMenuButton extends Component {
  static displayName = "ReturnMenuButton";

  static propTypes = {
    toggleReaderMenu: PropTypes.func.isRequired,
    expanded: PropTypes.bool
  };

  clickHandler = event => {
    event.stopPropagation();
    this.props.toggleReaderMenu();
  };

  render() {
    const { expanded } = this.props;
    const buttonClasses = classNames({
      "reader-header__button": true,
      "reader-header__button--pad-default": true,
      "button-active": expanded
    })
    return (
      <button
        className={buttonClasses}
        onClick={this.clickHandler}
        data-id="toggle-menu"
        aria-haspopup
        aria-expanded={expanded}
      >
        Menu
      </button>
    );
  }
}
