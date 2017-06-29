import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup as ReactCSSTransitionGroup } from 'react-transition-group';
import classNames from 'classnames';
import Utility from 'components/global/Utility';
import isString from 'lodash/isString';
import { withRouter } from 'react-router-dom';

class DrawerWrapper extends PureComponent {

  static displayName = "Drawer.Wrapper";

  static propTypes = {
    open: PropTypes.bool,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string
    ]),
    title: PropTypes.string,
    icon: PropTypes.string,
    closeUrl: PropTypes.string,
    closeCallback: PropTypes.func,
    lockScroll: PropTypes.string,
    style: PropTypes.string,
  };

  // NB lockScroll can be:
  // Hover (default): User can scroll the drawer on hover, but it doesn't effect body scroll
  // unless they intentionally do so.
  // Always: Having the drawer open locks the body scroll until it is closed
  // None: Scrolling the drawer invokes default browser behavior
  static defaultProps = {
    lockScroll: 'hover',
    open: false,
    style: 'backend'
  };

  static childContextTypes = {
    pauseKeyboardEvents: PropTypes.func,
    unpauseKeyboardEvents: PropTypes.func
  };

  getChildContext() {
    return {
      pauseKeyboardEvents: this.pauseKeyboardEvents,
      unpauseKeyboardEvents: this.unpauseKeyboardEvents
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      leaving: false,
      keyboardEventsPaused: false
    };

    this.handleLeaveEvent = this.handleLeaveEvent.bind(this);
    this.handleLeaveKey = this.handleLeaveKey.bind(this);
    this.pauseKeyboardEvents = this.pauseKeyboardEvents.bind(this);
    this.unpauseKeyboardEvents = this.unpauseKeyboardEvents.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keyup', this.handleLeaveKey);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleLeaveKey);
  }

  handleLeaveKey(event) {
    if (this.state.keyboardEventsPaused) return null;
    if (event.keyCode === 27) {
      this.handleLeaveEvent(event);
    }
  }

  pauseKeyboardEvents() {
    this.setState({ keyboardEventsPaused: true });
  }

  unpauseKeyboardEvents() {
    this.setState({ keyboardEventsPaused: false });
  }

  handleLeaveEvent(event) {
    this.setState({
      leaving: true
    });

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
        this.props.history.push(this.props.closeUrl);
      }, 200);
    }
  }

  renderDrawerFrontMatter() {
    if (!this.props.title && !this.props.icon) return null;
    return (
      <div className="drawer-title">
        {this.props.icon ?
          <i className={`manicon manicon-${this.props.icon}`}></i> : null
        }
        {this.props.title ?
          this.props.title : null
        }
      </div>
    );
  }

  renderDrawer() {
    const drawerStyleClass = classNames({
      'drawer-backend': this.props.style === 'backend',
      'drawer-backend wide': this.props.style === 'backend-wide',
      'drawer-frontend': this.props.style === 'frontend'
    });

    return (
      <div key="drawer" className={drawerStyleClass}>
        <div className="drawer-bar">
          {this.renderDrawerFrontMatter()}
          <div onClick={this.handleLeaveEvent} className="close-button-primary">
            <span className="close-text">
              Close
            </span>
            <i className="manicon manicon-x"></i>
            <span className="screen-reader-text">
              Close Drawer
            </span>
          </div>
        </div>
        {/* Render children without props if they aren't a component */}
        { this.renderChildren() }
      </div>
    );
  }

  renderChildren() {
    if (!this.props.children) return null;
    if (isString(this.props.children.type)) return this.props.children;
    return React.cloneElement(
      this.props.children,
      { closeDrawer: this.handleLeaveEvent }
    );
  }

  renderDrawerWrapper() {
    if (this.props.lockScroll === 'hover') {
      return (
        <div>
          <Utility.EdgeLockScroll>
            {this.renderDrawer()}
          </Utility.EdgeLockScroll>
        </div>
      );
    }

    if (this.props.lockScroll === 'always') {
      return (
        <div>
          <Utility.LockBodyScroll>
            <div>
              <div className="drawer-overlay" onClick={this.handleLeaveEvent}></div>
              {this.renderDrawer()}
            </div>
          </Utility.LockBodyScroll>
        </div>
      );
    }

    return this.renderDrawer();
  }

  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName="drawer"
        // True value required to enable transform
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}
      >
        { this.props.open ? this.renderDrawerWrapper() : null }
      </ReactCSSTransitionGroup>
    );
  }
}

export default withRouter(DrawerWrapper);
