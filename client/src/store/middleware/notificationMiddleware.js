import { notificationActions } from 'actions';

export default function notificationMiddleware({ dispatch, getState }) {
  return (next) => (action) => {

    // Guards
    if (!__CLIENT__) return next(action);
    if (action.type !== 'ADD_NOTIFICATION') return next(action);
    const notification = action.payload;
    if (!notification) return next(action);

    // Handle notification expiration
    if (notification.expiration && notification.id) {
      let expire = parseInt(notification.expiration, 10);
      if (isNaN(expire)) expire = 5000;
      setTimeout(() => {
        dispatch(notificationActions.removeNotification(notification.id));
      }, expire);
    }

    return next(action);

  };
}
