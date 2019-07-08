import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";

export default class NotesButton extends PureComponent {
  static displayName = "ControlMenu.NotesButton";

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
      "button-notes": true,
      "button-active": this.props.active
    });
    return (
      <button
        className={buttonClass}
        onClick={this.clickHandler}
        data-id="toggle-notes"
        aria-haspopup
        aria-expanded={this.props.active}
      >
        <Utility.IconComposer icon="notes24" size={32} />
        <span className="screen-reader-text">Notes</span>
      </button>
    );
  }
}
