import React, { PureComponent } from "react";
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

    this.handleOverlayClick = this.handleOverlayClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleEscape = this.handleEscape.bind(this);
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

  handleEscape(event) {
    if (event.keyCode === 27 && this.props.showCloseButton === true) {
      this.doClose();
    }
  }

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

  handleOverlayClick(eventIgnored) {
    if (this.props.closeOnOverlayClick) this.doClose();
  }

  handleCloseClick(eventIgnored) {
    this.doClose();
  }

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
    return (
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
            <div className="dialog-overlay" onClick={this.handleOverlayClick} />
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
                >
                  <i className="manicon manicon-x" />
                  <span className="screen-reader-text">Close Dialog</span>
                </div>
              ) : null}
              {this.renderChildren()}
            </div>
          </div>
        )}
      </ReactCSSTransitionGroup>
    );
  }
}

export default withRouter(DialogWrapper);
