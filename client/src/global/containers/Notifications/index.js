import React, { Component } from "react";
import PropTypes from "prop-types";
import Notification from "global/components/Notification";
import { connect } from "react-redux";
import classNames from "classnames";
import { commonActions } from "actions/helpers";
import config from "config";

export class NotificationsComponent extends Component {
  static mapStateToProps = state => {
    return {
      notifications: state.notifications
    };
  };

  static propTypes = {
    scope: PropTypes.string.isRequired,
    animate: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    style: PropTypes.string.isRequired,
    addNotification: PropTypes.func,
    removeNotification: PropTypes.func,
    removeAllNotifications: PropTypes.func,
    notifications: PropTypes.object,
    noDismiss: PropTypes.bool
  };

  static defaultProps = {
    scope: "global",
    animate: true,
    style: "header"
  };

  constructor(props) {
    super(props);
    this.state = {
      removing: false
    };
    this.commonActions = commonActions(props.dispatch);
  }

  // Only necessary for debugging/testing notifications before they exist.
  componentDidMount() {
    if (config.environment.isDevelopment) {
      window.addEventListener("keyup", this.handleNotifications);
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.notifications !== this.props.notifications;
  }

  // Only necessary for debugging/testing notifications before they exist.
  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
    if (process.env.NODE_ENV === "development") {
      window.removeEventListener("keyup", this.handleNotifications);
    }
  }

  get filteredNotifications() {
    return this.props.notifications.notifications.filter(
      notification => notification.scope === this.props.scope
    );
  }

  get listClass() {
    return classNames(`notifications-list--context-${this.props.style}`, {
      "notifications-list": true,
      "notifications-list--updating": this.state.updating
    });
  }

  // Debug wrapper method to pass random notification in.
  // NB: Do not use to produce actual notifications.
  handleNotifications = event => {
    const headings = ["Error", "Warning", "Hey, Listen!"];
    const copy = ["Dummy error message copy", ""];
    if (event.ctrlKey && event.keyCode === 78) {
      this.commonActions.addNotification({
        level: Math.floor(Math.random() * 3),
        heading: headings[Math.floor(Math.random() * 3)],
        copy: copy[Math.floor(Math.random() * 2)]
      });
    } else if (event.ctrlKey && event.keyCode === 82) {
      this.commonActions.clearNotifications();
    }
  };

  removeNotification = id => {
    const notification = this.props.notifications.notifications.find(
      listNotification => listNotification.id === id
    );

    if (notification && notification.removeNotification) {
      notification.removeNotification();
    }

    // allow time for exit transition to run before unmounting
    if (this.notificationList) {
      this.notificationList.classList.add("removing");
    }
    setTimeout(() => {
      this.commonActions.clearNotifications();
      if (this.notificationList) {
        this.notificationList.classList.remove("removing");
      }
    }, 200);
  };

  render() {
    return (
      <section className="notifications-container" role="alert">
        <div
          ref={notificationList => {
            this.notificationList = notificationList;
          }}
          key="notifications-list"
          className={this.listClass}
        >
          {this.filteredNotifications.map(notification => (
            <Notification
              key={notification.id}
              style={this.props.style}
              id={notification.id}
              level={notification.level}
              heading={notification.heading}
              body={notification.body}
              removeNotification={this.removeNotification}
              noDismiss={this.props.noDismiss}
            />
          ))}
        </div>
      </section>
    );
  }
}

export default connect(NotificationsComponent.mapStateToProps)(
  NotificationsComponent
);
