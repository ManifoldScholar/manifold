import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Dialog } from "components/backend";
import isString from "lodash/isString";

export default class DialogConfirm extends PureComponent {
  static displayName = "Dialog.Confirm";

  static propTypes = {
    resolve: PropTypes.func.isRequired,
    reject: PropTypes.func.isRequired,
    heading: PropTypes.string,
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  };

  static contextTypes = {
    pauseKeyboardEvents: PropTypes.func,
    unpauseKeyboardEvents: PropTypes.func
  };

  static defaultProps = {
    heading: "Are you sure?"
  };

  componentDidMount() {
    if (this.context.pauseKeyboardEvents) this.context.pauseKeyboardEvents();
    window.addEventListener("keyup", this.handleKeyPress);
  }

  componentWillUnmount() {
    if (this.context.unpauseKeyboardEvents)
      this.context.unpauseKeyboardEvents();
    window.removeEventListener("keyup", this.handleKeyPress);
  }

  handleKeyPress = event => {
    event.preventDefault();
    if (event.keyCode === 27) return this.handleRejectClick(event);
    if (event.keyCode === 13) return this.handleResolveClick(event);
  };

  handleResolveClick = event => {
    event.preventDefault();
    this.props.resolve(event);
  };

  handleRejectClick = event => {
    event.preventDefault();
    this.props.reject(event);
  };

  render() {
    return (
      <Dialog.Wrapper
        className="dialog-confirm"
        maxWidth={400}
        showCloseButton={false}
        closeOnOverlayClick={false}
      >
        <header className="dialog-header-small">
          <h2>{this.props.heading}</h2>
        </header>

        {isString(this.props.message) ? (
          <p>{this.props.message}</p>
        ) : (
          this.props.message
        )}

        <div className="buttons-icon-horizontal">
          <button
            onClick={this.handleResolveClick}
            className="button-icon-secondary"
            data-id="accept"
          >
            <i className="manicon manicon-check small" aria-hidden="true" />
            Yes
          </button>
          <button
            className="button-icon-secondary dull"
            onClick={this.handleRejectClick}
            data-id="reject"
          >
            <i className="manicon manicon-x small" aria-hidden="true" />
            No
          </button>
        </div>
      </Dialog.Wrapper>
    );
  }
}
