import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";

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
        <Utility.IconComposer icon="eyeball24" size={32} />
        <span className="screen-reader-text">Open the visibility menu</span>
      </button>
    );
  }
}
