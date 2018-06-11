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
      <div>
        {visibility ? (
          <div className={visibilityClass}>
            <FocusTrap
              focusTrapOptions={{
                clickOutsideDeactivates: true,
                escapeDeactivates: false
              }}
            >
              <button
                className="screen-reader-text"
                onClick={this.props.hidePanel}
              >
                Close Panel
              </button>
              {/* Second argument as props */}
              {React.createElement(this.props.bodyComponent, { ...this.props })}
            </FocusTrap>
          </div>
        ) : null}
      </div>
    );
  }
}
