import { createAction } from 'redux-actions';
import uuid from 'uuid';

// Add notification that will assign a random ID if one does not exist already
export const addNotification = createAction('ADD_NOTIFICATION', subject => {
  const notification = subject;
  if (!notification.id) {
    notification.id = uuid.v1();
  }
  return notification;
});
export const removeNotification = createAction('REMOVE_NOTIFICATION', subject => subject);
export const removeAllNotifications = createAction('REMOVE_ALL_NOTIFICATIONS');
export const fatalError = createAction('FATAL_ERROR_NOTIFICATION', error => error);
export const removeFatalError = createAction('REMOVE_FATAL_ERROR_NOTIFICATION');
