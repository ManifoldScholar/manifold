import get from 'lodash/get';
import startsWith from 'lodash/startsWith';
import { notificationActions } from 'actions';

function isApiResponse(action) {
  return startsWith(action.type, 'API_RESPONSE');
}

function apiErrors(action) {
  const errors = get(action, 'payload.body.errors');
  if (!errors) return [];
  return errors.filter((error) => {
    return isApiError(error) && !isFatal(error)
  });
}

function firstFatalError(action) {
  const errors = get(action, 'payload.body.errors');
  if (!errors) return null;
  return errors.find((error) => {
    return isFatal(error);
  });
}

function notifyApiErrors(dispatch, action, next) {
  const errors = apiErrors(action);
  if (errors.length === 0) return next(action);
  errors.forEach((error) => {
    dispatch(notificationActions.addNotification({
      id: error.id,
      level: 2,
      heading: error.title,
      body: error.detail
    }))
  });
}

function isApiError(error) {
  console.log(error, 'err');
  return error.id === "API_ERROR"
}

function isFatal(error) {
  return [503].includes(error.status);
}

function checkForFatalErrors(dispatch, action, next) {
  const fatalError = firstFatalError(action);
  if (!fatalError) return false;
  dispatch(notificationActions.fatalError(fatalError));
}
export default function entityStoreMiddleware({ dispatch, getState }) {
  return (next) => (action) => {
    if (!isApiResponse(action)) return next(action);
    notifyApiErrors(dispatch, action, next);
    checkForFatalErrors(dispatch, action, next);
    return next(action);
  }
};
