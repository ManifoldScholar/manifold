import React, { Component } from "react";
import PropTypes from "prop-types";

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
    // NB: An active prop is passed to the button by default and can be used
    // to set a classname here.
    return (
      <button
        className="button-menu"
        onClick={this.clickHandler}
        data-id="toggle-menu"
        aria-haspopup
        aria-expanded={this.props.expanded}
      >
        Menu
      </button>
    );
  }
}
