import React, { Component } from "react";
import PropTypes from "prop-types";
import { HeaderNotification } from "components/global";
import { CSSTransitionGroup as ReactCSSTransitionGroup } from "react-transition-group";
import classNames from "classnames";
import get from "lodash/get";

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
    if (process.env.NODE_ENV === "development") {
      window.addEventListener("keyup", this.handleNotifications);
    }
  }

  componentWillReceiveProps() {
    if (this.notificationList) {
      this.setState({
        height: this.notificationList.offsetHeight,
        updating: false
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.notifications !== this.props.notifications;
  }

  componentDidUpdate() {
    if (this.notificationList) {
      const listHeight = this.notificationList.offsetHeight;
      // This causes problems for HMR. We'll need to revisit.
      this.timer = setTimeout(() => {
        if (!this.state.updating) {
          this.setState({
            updating: true
          });
          this.timer = null;
        }
        if (this.notificationList) {
          this.notificationList.setAttribute(
            "style",
            "transform: translate3d(0, 0px, 0); height: auto;"
          );
        }
      }, 200);
      this.notificationList.setAttribute(
        "style",
        "transform: " +
          "translate3d(0, " +
          (this.state.height - listHeight) +
          "px, 0);" +
          "height:" +
          this.state.height +
          "px;"
      );
    }
  }

  // Only necessary for debugging/testing notifications before they exist.
  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
    if (process.env.NODE_ENV === "development") {
      window.removeEventListener("keyup", this.handleNotifications);
    }
  }

  globalNotifications() {
    const notifications = this.props.notifications.notifications;
    return notifications.filter(notification => {
      if (!get(notification, "scope") || notification.scope === "global") {
        return true;
      }
      return false;
    });
  }

  // Debug wrapper method to pass random notification in.
  // NB: Do not use to produce actual notifications.
  handleNotifications(event) {
    const headings = ["Error", "Warning", "Hey, Listen!"];
    const copy = ["Dummy error message copy", ""];
    if (event.ctrlKey && event.keyCode === 78) {
      this.props.addNotification({
        level: Math.floor(Math.random() * 3),
        heading: headings[Math.floor(Math.random() * 3)],
        copy: copy[Math.floor(Math.random() * 2)]
      });
    } else if (event.ctrlKey && event.keyCode === 82) {
      this.props.removeAllNotifications();
    }
  }

  listClass() {
    return classNames({
      "header-notifications-list": true,
      updating: this.state.updating
    });
  }

  renderNotifications() {
    let notificationList = null;
    if (this.props.notifications.notifications.length > 0) {
      notificationList = this.globalNotifications().map(notification => {
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
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
      >
        {notificationList}
      </ReactCSSTransitionGroup>
    );
  }

  render() {
    return (
      <section className="header-notifications-container">
        <div
          ref={notificationList => {
            this.notificationList = notificationList;
          }}
          key="notifications-list"
          className={this.listClass()}
        >
          {this.renderNotifications()}
        </div>
      </section>
    );
  }
}
