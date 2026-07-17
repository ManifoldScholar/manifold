import React, { Component } from "react";
import PropTypes from "prop-types";
import Notification from "global/components/Notification";
import { connect } from "react-redux";
import classNames from "classnames";
import { commonActions } from "actions/helpers";
import config from "config";

// Delay before a newly-added notification's text is placed in the live region,
// so the DOM mutation lands after a route transition's churn and is reliably
// picked up.
const ANNOUNCE_DELAY = 200;
const ANNOUNCE_RESET_DELAY = 100;

// `body` may be a string or a React node; only string bodies are announceable.
function notificationText(notification) {
  const parts = [notification.heading];
  if (typeof notification.body === "string") parts.push(notification.body);
  return parts.filter(Boolean).join(". ");
}

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
      removing: false,
      announcement: ""
    };
    this.commonActions = commonActions(props.dispatch);
    this.pendingText = "";
    // Seed with the ids already present so notifications that exist at mount
    // aren't announced.
    this.announcedIds = new Set(
      this.filteredNotifications.map(notification => notification.id)
    );
  }

  // Only necessary for debugging/testing notifications before they exist.
  componentDidMount() {
    if (config.environment.isDevelopment) {
      window.addEventListener("keyup", this.handleNotifications);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.notifications !== this.props.notifications ||
      nextState.announcement !== this.state.announcement
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.notifications === this.props.notifications) return;

    const current = this.filteredNotifications;
    const currentIds = new Set(current.map(notification => notification.id));

    // Forget ids that have left the store so a later re-add announces again.
    this.announcedIds.forEach(id => {
      if (!currentIds.has(id)) this.announcedIds.delete(id);
    });

    // Once every notification is gone, cancel any pending announcement and tidy
    // the live region so stale text isn't left behind.
    if (current.length === 0) {
      if (this.announceTimer) {
        clearTimeout(this.announceTimer);
        this.announceTimer = null;
      }
      this.pendingText = "";
      if (this.state.announcement) this.setState({ announcement: "" });
      return;
    }

    // Announce only genuinely new notifications. Keying off ids (rather than the
    // notifications array identity) means a store-slice replacement that leaves
    // the notifications unchanged — ROUTE_UPDATE fires on every navigation and
    // returns a new slice object — neither re-announces nor cancels a pending
    // announcement.
    const fresh = current.filter(
      notification => !this.announcedIds.has(notification.id)
    );
    if (fresh.length === 0) return;

    fresh.forEach(notification => this.announcedIds.add(notification.id));
    const text = fresh
      .map(notificationText)
      .filter(Boolean)
      .join(". ");
    if (!text) return;

    this.pendingText = this.pendingText ? `${this.pendingText}. ${text}` : text;
    if (this.announceTimer) clearTimeout(this.announceTimer);
    this.announceTimer = setTimeout(this.announce, ANNOUNCE_DELAY);
  }

  // Only necessary for debugging/testing notifications before they exist.
  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
    if (this.announceTimer) clearTimeout(this.announceTimer);
    if (this.resetTimer) clearTimeout(this.resetTimer);
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

  announce = () => {
    const text = this.pendingText;
    this.pendingText = "";
    // Clear then re-set so an identical consecutive message still registers as
    // a change. The region is polite, so the message waits behind the assertive
    // route announcer rather than competing with it.
    this.setState({ announcement: "" });
    if (this.resetTimer) clearTimeout(this.resetTimer);
    this.resetTimer = setTimeout(() => {
      this.setState({ announcement: text });
    }, ANNOUNCE_RESET_DELAY);
  };

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
      <section className="notifications-container">
        <div
          className="screen-reader-text"
          aria-live="polite"
          aria-atomic="true"
        >
          {this.state.announcement}
        </div>
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
