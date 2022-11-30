import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { CSSTransition } from "react-transition-group";
import FocusTrap from "focus-trap-react";

export default class UIPanel extends Component {
  static propTypes = {
    id: PropTypes.string,
    visibility: PropTypes.object,
    bodyComponent: PropTypes.elementType,
    hidePanel: PropTypes.func
  };

  render() {
    const visibility = this.props.visibility[this.props.id];
    const visibilityClass = classNames({
      "panel-hidden": !visibility,
      "panel-visible": visibility
    });

    return (
      <CSSTransition
        key={this.props.id}
        in={visibility}
        classNames="panel"
        timeout={200}
        unmountOnExit
      >
        <div className={visibilityClass}>
          <FocusTrap
            focusTrapOptions={{
              clickOutsideDeactivates: true,
              escapeDeactivates: e => this.props.hidePanel(e)
            }}
          >
            <div>
              <button
                className="screen-reader-text"
                onClick={this.props.hidePanel}
              >
                Close Panel
              </button>
              {React.createElement(this.props.bodyComponent, {
                ...this.props,
                closeCallback: this.props.hidePanel
              })}
            </div>
          </FocusTrap>
        </div>
      </CSSTransition>
    );
  }
}
