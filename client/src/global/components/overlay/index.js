import React, { Component } from "react";
import PropTypes from "prop-types";
import FocusTrap from "focus-trap-react";
import isString from "lodash/isString";

import BodyClass from "hoc/body-class";

export default class Overlay extends Component {
  static propTypes = {
    open: PropTypes.bool,
    history: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    title: PropTypes.string,
    icon: PropTypes.string,
    closeUrl: PropTypes.string,
    closeCallback: PropTypes.func,
    contentWidth: PropTypes.number,
    appearance: PropTypes.string,
    triggerScrollToTop: PropTypes.any
  };

  constructor() {
    super();
    this.state = {
      view: null
    };
  }

  componentDidMount() {
    window.addEventListener("keyup", this.handleEscape);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.triggerScrollToTop !== this.props.triggerScrollToTop) {
      this.scrollableEl.scrollTop = 0;
    }
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.handleEscape);
  }

  handleCloseEvent = event => {
    if (this.props.closeCallback) {
      this.props.closeCallback(event);
    }
    if (this.props.closeUrl) {
      setTimeout(() => {
        this.props.history.push(this.props.closeUrl);
      }, 200);
    }
  };

  handleEscape = event => {
    if (event.keyCode === 27) {
      this.handleCloseEvent(event);
    }
  };

  overlayClass() {
    return this.props.appearance ? this.props.appearance : "overlay-full";
  }

  renderChildren() {
    if (!this.props.children) return null;
    if (isString(this.props.children.type)) return this.props.children;
    return React.cloneElement(this.props.children, {
      closeDrawer: this.handleLeaveEvent
    });
  }

  renderTitle(icon, title) {
    return (
      <div className="container">
        <h3 className="overlay-title">
          <i className={`manicon manicon-${icon}`} aria-hidden="true" />
          {title}
        </h3>
      </div>
    );
  }

  renderHeader(props) {
    if (!props.title) return null;
    return (
      <header className="overlay-full-header" key={"globalOverlayHeader"}>
        {this.renderTitle(this.props.icon, this.props.title)}
        <button
          onClick={this.handleCloseEvent}
          className="overlay-close"
          data-id="overlay-close"
        >
          Close
          <i className="manicon manicon-x" aria-hidden="true" />
        </button>
      </header>
    );
  }

  render() {
    return (
      <BodyClass className={"no-scroll overlay"}>
        <div
          className={this.overlayClass()}
          key={"globalOverlay"}
          ref={el => {
            this.scrollableEl = el;
          }}
        >
          <FocusTrap
            focusTrapOptions={{
              escapeDeactivates: false
            }}
          >
            {this.renderHeader(this.props)}
            {!this.props.title ? (
              <button
                onClick={this.handleCloseEvent}
                className="overlay-close"
                data-id="overlay-close"
              >
                Close
                <i className="manicon manicon-x" aria-hidden="true" />
              </button>
            ) : null}
            <div
              style={{ maxWidth: this.props.contentWidth }}
              className="container"
            >
              {this.renderChildren()}
            </div>
          </FocusTrap>
        </div>
      </BodyClass>
    );
  }
}