import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { CSSTransitionGroup as ReactCSSTransitionGroup } from "react-transition-group";
import FocusTrap from "focus-trap-react";

export default class UIPanel extends Component {
  static propTypes = {
    id: PropTypes.string,
    visibility: PropTypes.object,
    bodyComponent: PropTypes.func,
    hidePanel: PropTypes.func
  };

  componentDidMount() {
    document.addEventListener("keyup", this.handleLeaveKey);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleLeaveKey);
  }

  handleLeaveKey = event => {
    if (event.keyCode === 27) {
      this.props.hidePanel(event);
    }
  };

  render() {
    const visibility = this.props.visibility[this.props.id];
    const visibilityClass = classNames({
      "panel-hidden": !visibility,
      "panel-visible": visibility
    });

    return (
      /* eslint-disable react/jsx-boolean-value */
      <ReactCSSTransitionGroup
        transitionName="panel"
        transitionEnter={false}
        transitionLeaveTimeout={200}
      >
        {visibility ? (
          <div className={visibilityClass} key={this.props.id}>
            <FocusTrap
              focusTrapOptions={{
                clickOutsideDeactivates: true,
                escapeDeactivate: false
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
      </ReactCSSTransitionGroup>
    );
    /* eslint-enable react/jsx-boolean-value */
  }
}
