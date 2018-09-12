import get from "lodash/get";
import has from "lodash/has";
import startsWith from "lodash/startsWith";
import { notificationActions } from "actions";

function isApiError(error) {
  return error.id === "API_ERROR";
}

function isFatal(error) {
  return [500, 501, 502, 503, 504, 511, 404].includes(error.status);
}

function isApiResponse(action) {
  return startsWith(action.type, "API_RESPONSE");
}

function apiErrors(action) {
  const errors = get(action, "payload.body.errors");
  if (!errors) return [];
  return errors.filter(error => {
    return isApiError(error) && !isFatal(error);
  });
}

function firstFatalError(action) {
  let errors;
  errors = get(action, "payload.body.errors");
  if (!errors && action.error === true && has(action, "payload.body.status")) {
    errors = [action.payload.body];
  }
  if (!errors) return null;
  return errors.find(error => {
    return isFatal(error);
  });
}

function notifyApiErrors(dispatch, action) {
  const errors = apiErrors(action);
  if (errors.length === 0) return;
  errors.forEach(error => {
    dispatch(
      notificationActions.addNotification({
        id: error.id,
        level: 2,
        heading: error.title,
        body: error.detail
      })
    );
  });
}

function checkForFatalErrors(dispatch, action) {
  const fatalError = firstFatalError(action);
  if (!fatalError) return false;
  dispatch(notificationActions.fatalError(fatalError));
}

export default function entityStoreMiddleware({ dispatch, getStateIgnored }) {
  return next => action => {
    if (!isApiResponse(action)) return next(action);
    notifyApiErrors(dispatch, action);
    checkForFatalErrors(dispatch, action);
    return next(action);
  };
}
