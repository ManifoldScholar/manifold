import React, { Component, PropTypes } from 'react';
import HeaderNotification from './HeaderNotification';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classNames from 'classnames';
import get from 'lodash/get';

export default class HeaderNotifications extends Component {
  static propTypes = {
    addNotification: PropTypes.func,
    removeNotification: PropTypes.func,
    removeAllNotifications: PropTypes.func,
    notifications: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      height: 0,
      updating: false
    };
    this.handleNotifications = this.handleNotifications.bind(this);
    this.globalNotifications = this.globalNotifications.bind(this);
  }

  // Only necessary for debugging/testing notifications before they exist.
  componentDidMount() {
    if (__DEVELOPMENT__) {
      window.addEventListener('keyup', this.handleNotifications);
    }
  }

  componentWillReceiveProps() {
    if (this.refs.notificationList) {
      this.setState({
        height: this.refs.notificationList.offsetHeight,
        updating: false
      });
    }
  }

  componentDidUpdate() {
    if (this.refs.notificationList) {
      const listHeight = this.refs.notificationList.offsetHeight;
      setTimeout(() => {
        if (!this.state.updating) {
          this.setState({
            updating: true
          });
        }
        this.refs.notificationList.setAttribute('style', 'transform: translate3d(0, 0px, 0);' +
            'height: auto;');
      }, 200);
      this.refs.notificationList.setAttribute('style',
          'transform: ' + 'translate3d(0, ' + (this.state.height - listHeight) + 'px, 0);' +
          'height:' + this.state.height + 'px;');
    }
  }

  // Only necessary for debugging/testing notifications before they exist.
  componentWillUnmount() {
    if (__DEVELOPMENT__) {
      window.removeEventListener('keyup', this.handleNotifications);
    }
  }

  globalNotifications() {
    const notifications = this.props.notifications.notifications;
    return notifications.filter((notification) => {
      if (!get(notification, 'scope') || notification.scope === 'global') {
        return true;
      }
      return false;
    });
  }

  // Debug wrapper method to pass random notification in.
  // NB: Do not use to produce actual notifications.
  handleNotifications() {
    const headings = ['Error', 'Warning', 'Hey, Listen!'];
    const copy = ['Dummy error message copy', ''];
    if (event.ctrlKey && event.keyCode === 78) {
      this.props.addNotification({
        level: Math.floor(Math.random() * (3)),
        heading: headings[Math.floor(Math.random() * (3))],
        copy: copy[Math.floor(Math.random() * (2))]
      });
    } else if (event.ctrlKey && event.keyCode === 82) {
      this.props.removeAllNotifications();
    }
  }

  listClass() {
    return classNames({
      'header-notifications-list': true,
      updating: this.state.updating
    });
  }

  renderNotifications() {
    let notificationList = null;
    if (this.props.notifications.notifications.length > 0) {
      notificationList = this.globalNotifications().map((notification) => {
        return (
          <div key={notification.id} className="header-notification-container">
            <HeaderNotification
              id={notification.id}
              level={notification.level}
              heading={notification.heading}
              body={notification.body}
              removeNotification={this.props.removeNotification}
            />
          </div>
        );
      });
    }

    return (
      <ReactCSSTransitionGroup
        transitionName="notification"
        transitionEnterTimeout={100}
        transitionLeaveTimeout={2000}
      >
        {notificationList}
      </ReactCSSTransitionGroup>
    );
  }

  render() {
    return (
      <section className="header-notifications-container">
        <div ref="notificationList" key="notifications-list" className={this.listClass()}>
          {this.renderNotifications()}
        </div>
      </section>
    );
  }
}
