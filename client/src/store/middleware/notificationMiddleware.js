import { notificationActions } from "actions";
import startsWith from "lodash/startsWith";
import { notifications } from "api";

function isAddNotificationAction(action) {
  if (!__CLIENT__) return false;
  return action.type === "ADD_NOTIFICATION" && action.payload;
}

function isApiResponseAction(action) {
  if (!__CLIENT__) return false;
  return startsWith(action.type, "API_RESPONSE");
}

function handleAddNotificationAction(dispatch, action) {
  const notification = action.payload;
  if (notification.expiration && notification.id) {
    let expire = parseInt(notification.expiration, 10);
    if (isNaN(expire)) expire = 5000;
    setTimeout(() => {
      dispatch(notificationActions.removeNotification(notification.id));
    }, expire);
  }
}

function handleApiResponseAction(dispatch, action) {
  if (!action.meta) return;
  if (!notifications.hasOwnProperty(action.meta)) return;
  const key = action.error === true ? `${action.meta}-error` : action.meta;
  if (!notifications[key]) return;
  const notification = Object.assign({}, notifications[key](action.payload), {
    id: action.meta
  });
  dispatch(notificationActions.addNotification(notification));
}

export default function notificationMiddleware({ dispatch, getStateIgnored }) {
  return next => action => {
    if (isAddNotificationAction(action))
      handleAddNotificationAction(dispatch, action);
    if (isApiResponseAction(action)) handleApiResponseAction(dispatch, action);
    return next(action);
  };
}
