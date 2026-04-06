import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";

export default class ControlMenuButton extends PureComponent {
  static displayName = "ControlMenu.Button";

  static propTypes = {
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    active: PropTypes.bool,
    ariaControls: PropTypes.string,
    ariaHasPopup: PropTypes.string
  };

  handleClick = event => {
    event.stopPropagation();
    this.props.onClick();
  };

  render() {
    const buttonClass = classNames({
      "reader-header__button": true,
      "reader-header__button--pad-narrow": true,
      "button-active": this.props.active
    });

    return (
      <button
        className={buttonClass}
        onClick={this.handleClick}
        data-id={`toggle-${this.props.label}`}
        aria-expanded={this.props.active}
        aria-controls={this.props.ariaControls}
        {...(this.props.ariaHasPopup
          ? { "aria-haspopup": this.props.ariaHasPopup }
          : {})}
      >
        <Utility.IconComposer icon={this.props.icon} size={32} />
        <span className="screen-reader-text">{this.props.label}</span>
      </button>
    );
  }
}
