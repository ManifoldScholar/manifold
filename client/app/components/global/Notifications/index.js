import React, { useEffect, useRef, useCallback, useState } from "react";
import PropTypes from "prop-types";
import Notification from "./Notification";
import classNames from "classnames";
import { useNotifications } from "hooks";

// Delay before a newly-added notification's text is placed in the live region,
// so the DOM mutation lands after a route transition's churn and is reliably
// picked up.
const ANNOUNCE_DELAY = 200;
const ANNOUNCE_RESET_DELAY = 100;

function notificationText(notification) {
  const parts = [notification.heading];
  if (typeof notification.body === "string") parts.push(notification.body);
  return parts.filter(Boolean).join(". ");
}

function Notifications({ scope = "global", style = "header", noDismiss }) {
  const {
    notifications,
    addNotification,
    removeNotifications
  } = useNotifications();
  const notificationListRef = useRef(null);

  const filteredNotifications = notifications.filter(n => n.scope === scope);

  const [announcement, setAnnouncement] = useState("");
  const pendingTextRef = useRef("");
  const announceTimerRef = useRef(null);
  const resetTimerRef = useRef(null);
  // Seed with the ids already present so notifications that exist at mount
  // aren't announced.
  const announcedIdsRef = useRef(
    new Set(filteredNotifications.map(notification => notification.id))
  );

  const announce = useCallback(() => {
    const text = pendingTextRef.current;
    pendingTextRef.current = "";
    // Clear then re-set so an identical consecutive message still registers as
    // a change. The region is polite, so the message waits behind the assertive
    // route announcer rather than competing with it.
    setAnnouncement("");
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      setAnnouncement(text);
    }, ANNOUNCE_RESET_DELAY);
  }, []);

  useEffect(() => {
    const current = notifications.filter(n => n.scope === scope);
    const currentIds = new Set(current.map(notification => notification.id));
    const announcedIds = announcedIdsRef.current;

    // Forget ids that have left the store so a later re-add announces again.
    announcedIds.forEach(id => {
      if (!currentIds.has(id)) announcedIds.delete(id);
    });

    if (current.length === 0) {
      if (announceTimerRef.current) {
        clearTimeout(announceTimerRef.current);
        announceTimerRef.current = null;
      }
      pendingTextRef.current = "";
      setAnnouncement("");
      return;
    }

    // Announce only genuinely new notifications, keyed off ids rather than
    // array identity so unrelated updates neither re-announce nor cancel a
    // pending announcement.
    const fresh = current.filter(
      notification => !announcedIds.has(notification.id)
    );
    if (fresh.length === 0) return;

    fresh.forEach(notification => announcedIds.add(notification.id));
    const text = fresh
      .map(notificationText)
      .filter(Boolean)
      .join(". ");
    if (!text) return;

    pendingTextRef.current = pendingTextRef.current
      ? `${pendingTextRef.current}. ${text}`
      : text;
    if (announceTimerRef.current) clearTimeout(announceTimerRef.current);
    announceTimerRef.current = setTimeout(announce, ANNOUNCE_DELAY);
  }, [notifications, scope, announce]);

  useEffect(() => {
    return () => {
      if (announceTimerRef.current) clearTimeout(announceTimerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

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
    if (import.meta.env.DEV) {
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
    <section className="notifications-container">
      <div className="screen-reader-text" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
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
