import React, { useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import Notification from "./Notification";
import classNames from "classnames";
import { useNotifications } from "hooks";
import config from "config";

function Notifications({ scope = "global", style = "header", noDismiss }) {
  const {
    notifications,
    addNotification,
    removeNotifications
  } = useNotifications();
  const notificationListRef = useRef(null);

  const filteredNotifications = notifications.filter(n => n.scope === scope);

  const handleNotifications = useCallback(
    event => {
      const headings = ["Error", "Warning", "Hey, Listen!"];
      const copy = ["Dummy error message copy", ""];
      if (event.ctrlKey && event.keyCode === 78) {
        addNotification({
          level: Math.floor(Math.random() * 3),
          heading: headings[Math.floor(Math.random() * 3)],
          copy: copy[Math.floor(Math.random() * 2)]
        });
      } else if (event.ctrlKey && event.keyCode === 82) {
        removeNotifications(scope);
      }
    },
    [addNotification, removeNotifications, scope]
  );

  useEffect(() => {
    if (config.environment.isDevelopment) {
      window.addEventListener("keyup", handleNotifications);
      return () => window.removeEventListener("keyup", handleNotifications);
    }
  }, [handleNotifications]);

  const handleRemove = useCallback(
    id => {
      const notification = notifications.find(n => n.id === id);
      if (notification && notification.removeNotification) {
        notification.removeNotification();
      }

      if (notificationListRef.current) {
        notificationListRef.current.classList.add("removing");
      }
      setTimeout(() => {
        removeNotifications(scope);
        if (notificationListRef.current) {
          notificationListRef.current.classList.remove("removing");
        }
      }, 200);
    },
    [notifications, removeNotifications, scope]
  );

  const listClass = classNames(`notifications-list--context-${style}`, {
    "notifications-list": true
  });

  return (
    <section className="notifications-container" role="alert">
      <div
        ref={notificationListRef}
        key="notifications-list"
        className={listClass}
      >
        {filteredNotifications.map(notification => (
          <Notification
            key={notification.id}
            style={style}
            id={notification.id}
            level={notification.level}
            heading={notification.heading}
            body={notification.body}
            removeNotification={handleRemove}
            noDismiss={noDismiss}
          />
        ))}
      </div>
    </section>
  );
}

Notifications.displayName = "Global.Containers.Notifications";

Notifications.propTypes = {
  scope: PropTypes.string,
  style: PropTypes.string,
  noDismiss: PropTypes.bool
};

export default Notifications;
