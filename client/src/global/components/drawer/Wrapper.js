import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import Utility from "global/components/utility";
import Notifications from "global/containers/Notifications";
import isString from "lodash/isString";
import FocusTrap from "focus-trap-react";
import tabbable from "tabbable";
import has from "lodash/has";
import classNames from "classnames";
import { notificationActions } from "actions";
import IconComposer from "global/components/utility/IconComposer";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

export default class DrawerWrapper extends PureComponent {
  static mapStateToProps() {
    return {
      connected: true
    };
  }

  static displayName = "Drawer.Wrapper";

  static propTypes = {
    dispatch: PropTypes.func,
    connected: PropTypes.bool.isRequired,
    open: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    title: PropTypes.string,
    icon: PropTypes.string,
    identifier: PropTypes.string,
    closeUrl: PropTypes.string,
    closeCallback: PropTypes.func,
    lockScroll: PropTypes.string,
    lockScrollClickCloses: PropTypes.bool,
    entrySide: PropTypes.oneOf(["right", "left"]),
    context: PropTypes.oneOf(["backend", "frontend", "reader"]),
    size: PropTypes.oneOf(["default", "wide", "flexible"]),
    position: PropTypes.oneOf(["default", "overlay"]),
    padding: PropTypes.oneOf(["none", "default", "large"]),
    history: PropTypes.object,
    includeDrawerFrontMatter: PropTypes.bool,
    returnFocusOnDeactivate: PropTypes.bool,
    focusTrap: PropTypes.bool,
    includeSRCloseButton: PropTypes.bool
  };

  static childContextTypes = {
    pauseKeyboardEvents: PropTypes.func,
    unpauseKeyboardEvents: PropTypes.func
  };

  // NB lockScroll can be:
  // Hover (default): User can scroll the drawer on hover, but it doesn't effect body scroll
  // unless they intentionally do so.
  // Always: Having the drawer open locks the body scroll until it is closed
  // None: Scrolling the drawer invokes default browser behavior
  static defaultProps = {
    connected: false,
    lockScroll: "hover",
    lockScrollClickCloses: true,
    open: false,
    context: "backend",
    size: "default",
    padding: "default",
    position: "default",
    entrySide: "right",
    includeDrawerFrontMatter: true,
    returnFocusOnDeactivate: true,
    focusTrap: true,
    includeSRCloseButton: false
  };

  constructor(props) {
    super(props);
    this.state = {
      leaving: false,
      keyboardEventsPaused: false,
      focusable: false
    };
    this.focusTrapNode = React.createRef();
    this.scrollableNode = React.createRef();
    if (props.open) {
      this.onOpen();
    }
  }

  getChildContext() {
    return {
      pauseKeyboardEvents: this.pauseKeyboardEvents,
      unpauseKeyboardEvents: this.unpauseKeyboardEvents
    };
  }

  static getDerivedStateFromProps(nextProps, prevStateIgnored) {
    if (React.Children.count(nextProps.children) <= 0) {
      return { focusable: false };
    }

    return null;
  }

  componentDidMount() {
    document.addEventListener("keyup", this.handleLeaveKey);
    this.enableScrollLock();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.open && this.props.open) {
      this.onOpen();
      this.enableScrollLock();
    }

    if (prevProps.open && !this.props.open) {
      this.disableScrollLock();
    }

    if (this.props.open && has(this.focusTrapNode, "current.node")) {
      if (tabbable(this.focusTrapNode.current.node).length > 0) {
        this.setState({ focusable: true });
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleLeaveKey);
    this.disableScrollLock();
  }

  onOpen() {
    this.clearGlobalNotifications();
  }

  enableScrollLock() {
    if (!this.canLockScroll) return;
    disableBodyScroll(this.scrollableNode.current);
  }

  disableScrollLock() {
    if (!this.canLockScroll) return;
    enableBodyScroll(this.scrollableNode.current);
  }

  clearDrawerNotifications() {
    if (this.props.dispatch)
      this.props.dispatch(notificationActions.removeNotifications("drawer"));
  }

  clearGlobalNotifications() {
    if (this.props.dispatch)
      this.props.dispatch(notificationActions.removeNotifications("global"));
  }

  handleLeaveKey = event => {
    if (this.state.keyboardEventsPaused) return null;
    if (event.keyCode === 27) {
      this.handleLeaveEvent(event);
    }
  };

  pauseKeyboardEvents = () => {
    this.setState({ keyboardEventsPaused: true });
  };

  unpauseKeyboardEvents = () => {
    this.setState({ keyboardEventsPaused: false });
  };

  handleLeaveEvent = event => {
    this.setState({ leaving: true });

    this.clearDrawerNotifications();

    /*
      NB: Running this callback without a timeout causes the drawer
      to close without a transition. However, running a timeout causes
      an error as well.
    */
    if (this.props.closeCallback) {
      this.props.closeCallback(event);
    }

    if (this.props.closeUrl) {
      setTimeout(() => {
        this.props.history.push(this.props.closeUrl, { noScroll: true });
      }, 200);
    }
  };

  get canLockScroll() {
    return this.props.lockScroll === "always" && this.scrollableNode.current;
  }

  get drawerClasses() {
    return classNames(
      "drawer",
      [`drawer--${this.props.context}`],
      [`drawer--${this.props.entrySide}`],
      [`drawer--${this.props.size}`],
      [`drawer--pad-${this.props.padding}`],
      [`drawer--pos-${this.props.position}`]
    );
  }

  get drawerBarClasses() {
    return classNames({
      "drawer-bar": true,
      "drawer-bar--pad-lateral": this.props.padding === "none",
      "drawer-bar--default": this.props.context !== "reader",
      "drawer-bar--reader": this.props.context === "reader"
    });
  }

  get closeButtonClasses() {
    return classNames({
      "drawer-bar__close-button": true,
      "drawer-bar__close-button--light": this.props.context === "backend",
      "drawer-bar__close-button--dark": this.props.context !== "backend"
    });
  }

  get overlayClasses() {
    return classNames(
      "drawer-overlay",
      [`drawer-overlay--${this.props.context}`],
      [`drawer-overlay--pos-${this.props.position}`]
    );
  }

  renderDrawerFrontMatter(props) {
    const hasTitle = props.title || props.icon;
    const hasClose = props.closeCallback || props.closeUrl;

    return (
      <>
        {props.includeDrawerFrontMatter && (
          <div className={this.drawerBarClasses}>
            {hasTitle ? (
              <div className="drawer-bar__title">
                {props.icon && (
                  <IconComposer
                    icon={props.icon}
                    size={24}
                    iconClass="drawer-bar__title-icon"
                  />
                )}
                {props.title && (
                  <span className="drawer-bar__title-text">{props.title}</span>
                )}
              </div>
            ) : null}
            {hasClose ? (
              <button
                onClick={this.handleLeaveEvent}
                tabIndex="0"
                className={this.closeButtonClasses}
              >
                <span className="drawer-bar__close-text">Close</span>
                {/*
                <Utility.IconComposer
                  icon="close32"
                  size={46.222}
                  iconClass="drawer-bar__close-icon drawer-bar__close-icon--large"
                />
                */}
                <Utility.IconComposer
                  icon="close16"
                  size={24}
                  iconClass="drawer-bar__close-icon drawer-bar__close-icon--small"
                />
              </button>
            ) : null}
          </div>
        )}
        {props.includeSRCloseButton && (
          <button
            onClick={this.handleLeaveEvent}
            tabIndex="0"
            className="screen-reader-text"
          >
            Close
          </button>
        )}
      </>
    );
  }

  renderDrawer() {
    return (
      <div
        key="drawer"
        className={this.drawerClasses}
        ref={this.scrollableNode}
      >
        <FocusTrap
          ref={this.focusTrapNode}
          active={this.state.focusable && this.props.focusTrap}
          focusTrapOptions={{
            clickOutsideDeactivates: true,
            escapeDeactivates: false,
            returnFocusOnDeactivate: this.props.returnFocusOnDeactivate
          }}
        >
          {this.renderDrawerFrontMatter(this.props)}
          {this.props.connected && (
            <Notifications scope="drawer" style="drawer" animate={false} />
          )}
          {/* Render children without props if they aren't a component */}
          {this.renderChildren()}
        </FocusTrap>
      </div>
    );
  }

  renderChildren() {
    if (!this.props.children) return null;
    if (isString(this.props.children.type)) return this.props.children;
    return React.cloneElement(this.props.children, {
      closeDrawer: this.handleLeaveEvent
    });
  }

  renderDrawerWrapper() {
    if (this.props.lockScroll === "hover") {
      return (
        <div className={this.props.identifier}>
          <Utility.EdgeLockScroll>{this.renderDrawer()}</Utility.EdgeLockScroll>
        </div>
      );
    }
    if (this.props.lockScroll === "always") {
      return (
        <div className={this.props.identifier}>
          <div className={this.overlayClasses} />
          {this.renderDrawer()}
        </div>
      );
    }

    return this.renderDrawer();
  }

  render() {
    return (
      <CSSTransition
        in={this.props.open}
        classNames="drawer"
        timeout={{ enter: 500, exit: 300 }}
        unmountOnExit
      >
        {this.renderDrawerWrapper()}
      </CSSTransition>
    );
  }
}
