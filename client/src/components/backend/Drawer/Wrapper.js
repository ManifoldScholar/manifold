import React, { PureComponent, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router';
import Utility from 'components/global/Utility';

export default class DrawerWrapper extends PureComponent {

  static displayName = "Drawer.Wrapper";

  static propTypes = {
    closeUrl: PropTypes.string,
    closeCallback: PropTypes.func,
    lockScroll: PropTypes.bool
  };

  static defaultProps = {
    lockScroll: true
  };

  constructor(props) {
    super(props);
    this.state = {
      leaving: false
    };

    this.handleLeaveEvent = this.handleLeaveEvent.bind(this);
    this.handleLeaveKey = this.handleLeaveKey.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keyup', this.handleLeaveKey);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleLeaveKey);
  }

  handleLeaveKey(event) {
    if (event.keyCode === 27) {
      this.handleLeaveEvent(event);
    }
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
        browserHistory.push(this.props.closeUrl);
      }, 200);
    }
  }

  renderDrawer() {
    return (
      <div key="drawer" className="drawer-primary">
        <div className="rel">
          <div onClick={this.handleLeaveEvent} className="close-button-primary">
            <i className="manicon manicon-x"></i>
            <span className="screen-reader-text">
              Close Drawer
            </span>
          </div>
          {this.props.children}
        </div>
      </div>
    );
  }

  renderDrawerWrapper() {
    return this.props.lockScroll ? (
      <Utility.ScrollLock>
        {this.renderDrawer()}
      </Utility.ScrollLock>
    ) : this.renderDrawer();
      return (
        <Utility.EdgeLockScroll>
          {this.renderDrawer()}
        </Utility.EdgeLockScroll>
      );
    }

    return this.renderDrawer();
  }

  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName="drawer"
        // True value required to enable transform
        transitionEnterTimeout={5000}
        transitionLeaveTimeout={200}
      >
        { this.state.leaving ? null : this.renderDrawerWrapper() }
      </ReactCSSTransitionGroup>
    );
  }
}
