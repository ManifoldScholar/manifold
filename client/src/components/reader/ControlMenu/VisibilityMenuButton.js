import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class VisibilityMenuButton extends PureComponent {
  static displayName = "ControlMenu.VisibilityMenuButton";

  static propTypes = {
    toggle: PropTypes.func,
    active: PropTypes.bool
  };

  clickHandler = event => {
    event.stopPropagation();
    this.props.toggle();
  };

  render() {
    const buttonClass = classNames({
      "button-visibility": true,
      "button-active": this.props.active
    });

    return (
      <button
        className={buttonClass}
        onClick={this.clickHandler}
        data-id="toggle-visibility"
      >
        <i className="manicon manicon-eye-outline" aria-hidden="true" />
        <span className="screen-reader-text">Open the visibility menu</span>
      </button>
    );
  }
}
