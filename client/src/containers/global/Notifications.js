import React, { Component } from "react";
import PropTypes from "prop-types";
import { Notification } from "components/global";
import { CSSTransitionGroup as ReactCSSTransitionGroup } from "react-transition-group";
import { connect } from "react-redux";
import classNames from "classnames";
import { commonActions } from "actions/helpers";

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
    notifications: PropTypes.object
  };

  static defaultProps = {
    scope: "global",
    animate: true,
    style: "header"
  };

  constructor(props) {
    super(props);
    this.state = {
      height: 0,
      updating: false
    };
    this.commonActions = commonActions(props.dispatch);
  }

  // Only necessary for debugging/testing notifications before they exist.
  componentDidMount() {
    if (process.env.NODE_ENV === "development") {
      window.addEventListener("keyup", this.handleNotifications);
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.notifications !== this.props.notifications;
  }

  componentDidUpdate() {
    if (this.notificationList) {
      this.setState(
        {
          height: this.notificationList.offsetHeight,
          updating: false
        },
        this.updateNotifications
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

  updateNotifications() {
    const listHeight = this.notificationList.offsetHeight;

    if (this.props.animate === true) {
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

  filteredNotifications = () => {
    const notifications = this.props.notifications.notifications;
    return notifications.filter(notification => {
      if (notification.scope === this.props.scope) {
        return true;
      }
      return false;
    });
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

  listClass() {
    return classNames(`notifications-list-${this.props.style}`, {
      "notifications-list": true,
      updating: this.state.updating
    });
  }

  renderNotifications() {
    let notificationList = null;
    if (this.props.notifications.notifications.length > 0) {
      notificationList = this.filteredNotifications().map(notification => {
        return (
          <div key={notification.id} className="notification-container">
            <Notification
              style={this.props.style}
              id={notification.id}
              level={notification.level}
              heading={notification.heading}
              body={notification.body}
              removeNotification={this.commonActions.clearNotifications}
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
      <section className="notifications-container" role="alert">
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

export default connect(NotificationsComponent.mapStateToProps)(
  NotificationsComponent
);
