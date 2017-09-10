import React, { Component } from "react";
import PropTypes from "prop-types";
import { HigherOrder } from "components/global";
import isString from "lodash/isString";

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
    appearance: PropTypes.string
  };

  constructor() {
    super();
    this.state = {
      view: null
    };
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

  renderHeader(props) {
    if (!props.title) return null;
    return (
      <header className="overlay-full-header" key={"globalOverlayHeader"}>
        <div className="container">
          <h3 className="overlay-title">
            {this.props.title}
          </h3>
        </div>
        <button
          onClick={this.handleCloseEvent}
          className="overlay-close"
          data-id="overlay-close"
        >
          Close
          <i className="manicon manicon-x" />
        </button>
      </header>
    );
  }

  render() {
    return (
      <HigherOrder.BodyClass className={"no-scroll"}>
        <div>
          {this.renderHeader(this.props)}
          <div className={this.overlayClass()} key={"globalOverlay"}>
            {!this.props.title
              ? <button
                  onClick={this.handleCloseEvent}
                  className="overlay-close"
                  data-id="overlay-close"
                >
                  Close
                  <i className="manicon manicon-x" />
                </button>
              : null}
            <div
              style={{ maxWidth: this.props.contentWidth }}
              className="container"
            >
              {this.renderChildren()}
            </div>
          </div>
        </div>
      </HigherOrder.BodyClass>
    );
  }
}
