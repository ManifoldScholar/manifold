import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import FocusTrap from "focus-trap-react";

export default class UIPanel extends Component {
  static propTypes = {
    id: PropTypes.string,
    visibility: PropTypes.object,
    bodyComponent: PropTypes.func,
    hidePanel: PropTypes.func
  };

  render() {
    const visibility = this.props.visibility[this.props.id];
    const visibilityClass = classNames({
      "panel-hidden": !visibility,
      "panel-visible": visibility
    });

    return (
      <div className={visibilityClass}>
        <FocusTrap
          focusTrapOptions={{
            onDeactivate: this.props.hidePanel,
            clickOutsideDeactivates: true
          }}
          active={visibility}
        >
          {/* Second argument as props */}
          {React.createElement(this.props.bodyComponent, { ...this.props })}
        </FocusTrap>
      </div>
    );
  }
}
