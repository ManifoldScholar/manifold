import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { CSSTransitionGroup as ReactCSSTransitionGroup } from "react-transition-group";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import isString from "lodash/isString";

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
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
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

  componentDidMount() {
    window.addEventListener("keyup", this.handleEscape);
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.handleEscape);
  }

  setDialogClassName = additionalClassNames => {
    this.setState({ additionalClassNames });
  };

  handleEscape = event => {
    if (event.keyCode === 27 && this.props.showCloseButton === true) {
      this.doClose();
    }
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
    if (!this.props.closeHandler) return this.closeWithCallback();
    return this.closeWithNoAction();
  }

  handleOverlayClick = eventIgnored => {
    if (this.props.closeOnOverlayClick) this.doClose();
  };

  handleCloseClick = eventIgnored => {
    this.doClose();
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
      <ReactCSSTransitionGroup
        transitionName="dialog"
        // True value required to enable transform
        /* eslint-disable */
        transitionAppear={true}
        /* eslint-enable */
        transitionEnter={false}
        transitionAppearTimeout={1}
        transitionLeaveTimeout={200}
      >
        {this.state.leaving ? null : (
          <div key="dialog" className="dialog-primary dialog-appear">
            {this.props.closeOnOverlayClick ? (
              <div
                className="dialog-overlay"
                onClick={this.handleOverlayClick}
                role="button"
                tabIndex="0"
              >
                <span className="screen-reader-text">Close Dialog</span>
              </div>
            ) : (
              <div className="dialog-overlay" />
            )}
            <div
              className={classnames(
                "dialog-box",
                this.props.className,
                this.state.additionalClassNames
              )}
              style={this.style()}
            >
              {this.props.showCloseButton ? (
                <div
                  onClick={this.handleCloseClick}
                  className="close-button-primary"
                  role="button"
                  tabIndex="0"
                >
                  <i className="manicon manicon-x" aria-hidden="true" />
                  <span className="screen-reader-text">Close Dialog</span>
                </div>
              ) : null}
              {this.renderChildren()}
            </div>
          </div>
        )}
      </ReactCSSTransitionGroup>
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

export default withRouter(DialogWrapper);
