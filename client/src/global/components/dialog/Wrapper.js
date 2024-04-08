import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { CSSTransition } from "react-transition-group";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import FocusTrap from "focus-trap-react";
import isString from "lodash/isString";
import IconComposer from "global/components/utility/IconComposer";
import BodyClass from "hoc/BodyClass";

class DialogWrapper extends PureComponent {
  static displayName = "Dialog.Wrapper";

  static propTypes = {
    closeUrl: PropTypes.string,
    closeCallback: PropTypes.func,
    showCloseButton: PropTypes.bool,
    closeOnOverlayClick: PropTypes.bool,
    maxWidth: PropTypes.number,
    className: PropTypes.string,
    history: PropTypes.object,
    closeHandler: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    labelledBy: PropTypes.string,
    describedBy: PropTypes.string,
    onEsc: PropTypes.func,
    t: PropTypes.func
  };

  static defaultProps = {
    showCloseButton: true,
    closeOnOverlayClick: true
  };

  constructor(props) {
    super(props);
    this.state = {
      leaving: false,
      additionaClassNames: ""
    };
  }

  get overlayRole() {
    return this.props.closeOnOverlayClick ? "button" : null;
  }

  setDialogClassName = additionalClassNames => {
    this.setState({ additionalClassNames });
  };

  leave(callback) {
    this.setState({ leaving: true });
    setTimeout(callback, 200);
  }

  closeWithUrlChange() {
    this.leave(() => {
      this.props.history.push(this.props.closeUrl);
    });
  }

  closeWithNoAction() {
    this.leave(() => {});
  }

  closeWithCallback() {
    this.leave(this.props.closeCallback);
  }

  doClose() {
    if (this.props.closeUrl) return this.closeWithUrlChange();
    if (this.props.closeCallback) return this.closeWithCallback();
    return this.closeWithNoAction();
  }

  handleOverlayClick = event => {
    event.stopPropagation();
    if (this.props.closeOnOverlayClick) this.doClose();
  };

  handleCloseClick = event => {
    event.stopPropagation();
    this.doClose();
  };

  handleEscape = e => {
    e.stopPropagation();
    if (this.props.onEsc) return this.props.onEsc(e);
    return this.doClose();
  };

  style() {
    const style = {};
    if (this.props.maxWidth) style.maxWidth = this.props.maxWidth;
    return style;
  }

  renderChildren() {
    if (isString(this.props.children.type)) return this.props.children;
    if (React.Children.count(this.props.children) !== 1)
      return this.props.children;
    return React.cloneElement(this.props.children, {
      triggerClose: this.handleCloseClick,
      setDialogClassName: this.setDialogClassName
    });
  }

  render() {
    const output = (
      <CSSTransition
        in={!this.state.leaving}
        classNames="dialog"
        appear
        enter={false}
        timeout={{ enter: 1, exit: 200 }}
        unmountOnExit
      >
        <BodyClass className={"no-scroll"}>
          <FocusTrap
            focusTrapOptions={{
              escapeDeactivates: this.handleEscape
            }}
          >
            <div className="dialog-wrapper">
              {/* The <div> element's role is declared dynamically, confusing jsx-a11y */}
              {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
              <div
                className="dialog-overlay"
                onClick={this.handleOverlayClick}
                role={this.overlayRole}
              />
              <div
                role="dialog"
                aria-modal
                aria-labelledby={this.props.labelledBy}
                aria-describedby={this.props.describedBy}
                className={classnames(
                  "dialog",
                  this.props.className,
                  this.state.additionalClassNames
                )}
                style={this.style()}
              >
                {this.props.showCloseButton ? (
                  <button
                    onClick={this.handleCloseClick}
                    className="dialog__close"
                  >
                    <IconComposer icon="close16" size={24} />
                    <span className="screen-reader-text">
                      {this.props.t("modals.close")}
                    </span>
                  </button>
                ) : null}
                {this.renderChildren()}
              </div>
            </div>
          </FocusTrap>
        </BodyClass>
      </CSSTransition>
    );

    // Because this renders in a portal, it cannot render on the server. We probably never
    // render a dialog in a SSR render, but we do render it in tests. Not rendering in a
    // portal on the server makes it easier to test this component.
    if (__SERVER__) return output;

    // If we're in the client, render it into a portal so we can keep it at the top of the
    // z-index stack.
    const domTarget = document.getElementById("global-overlay-container");
    return ReactDOM.createPortal(output, domTarget);
  }
}

export default withTranslation()(withRouter(DialogWrapper));
