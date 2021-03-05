import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Wrapper from "./Wrapper";
import isString from "lodash/isString";
import isFunction from "lodash/isFunction";
import IconComposer from "global/components/utility/IconComposer";
import { UID } from "react-uid";

export default class DialogConfirm extends PureComponent {
  static displayName = "Dialog.Confirm";

  static propTypes = {
    resolve: PropTypes.func,
    reject: PropTypes.func.isRequired,
    heading: PropTypes.string,
    options: PropTypes.object,
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  };

  static contextTypes = {
    pauseKeyboardEvents: PropTypes.func,
    unpauseKeyboardEvents: PropTypes.func
  };

  static defaultProps = {
    heading: "Are you sure?",
    options: {
      resolveLabel: "Yes",
      rejectLabel: "No"
    }
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

  get buttonClasses() {
    return classNames(
      "buttons-icon-horizontal__button",
      "buttons-icon-horizontal__button--in-dialog",
      "button-icon-secondary"
    );
  }

  get canHandleResolve() {
    return isFunction(this.props.resolve);
  }

  get resolveLabel() {
    if (this.props.options && this.props.options.resolveLabel)
      return this.props.options.resolveLabel;
    return "Yes";
  }

  get rejectLabel() {
    if (this.props.options && this.props.options.rejectLabel)
      return this.props.options.rejectLabel;
    return this.canHandleResolve ? "No" : "OK";
  }

  handleKeyPress = event => {
    event.preventDefault();
    if (event.keyCode === 27) return this.handleRejectClick(event);
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
      <UID name={id => `dialog-${id}`}>
        {id => (
          <Wrapper
            className="dialog-confirm"
            maxWidth={400}
            showCloseButton={false}
            closeOnOverlayClick={false}
            labelledBy={`${id}-label`}
            describedBy={`${id}-description`}
          >
            <header className="dialog__header">
              <h2 id={`${id}-label`}>{this.props.heading}</h2>
            </header>

            {isString(this.props.message) ? (
              <p id={`${id}-description`}>{this.props.message}</p>
            ) : (
              this.props.message
            )}

            <div className="dialog__body buttons-icon-horizontal">
              {this.canHandleResolve && (
                <button
                  onClick={this.handleResolveClick}
                  className={this.buttonClasses}
                  data-id="accept"
                >
                  <IconComposer
                    icon="checkmark16"
                    size="default"
                    iconClass="button-icon-secondary__icon"
                  />
                  <span>{this.resolveLabel}</span>
                </button>
              )}
              <button
                className={classNames(
                  this.buttonClasses,
                  "button-icon-secondary--dull"
                )}
                onClick={this.handleRejectClick}
                data-id="reject"
              >
                <IconComposer
                  icon="close16"
                  size="default"
                  iconClass="button-icon-secondary__icon"
                />
                <span>{this.rejectLabel}</span>
              </button>
            </div>
          </Wrapper>
        )}
      </UID>
    );
  }
}
