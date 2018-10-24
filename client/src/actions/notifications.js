import { createAction } from "redux-actions";
import uuid from "uuid";

// Add notification that will assign a random ID if one does not exist already
export const addNotification = createAction("ADD_NOTIFICATION", subject => {
  const notification = subject;
  if (!notification.id) {
    notification.id = uuid.v1();
  }
  return notification;
});
export const removeNotification = createAction(
  "REMOVE_NOTIFICATION",
  subject => subject
);
export const removeNotifications = createAction(
  "REMOVE_NOTIFICATIONS",
  scope => scope
);
export const removeAllNotifications = createAction("REMOVE_ALL_NOTIFICATIONS");
