import get from "lodash/get";
import has from "lodash/has";
import startsWith from "lodash/startsWith";
import { fatalErrorActions, notificationActions } from "actions";

function isApiError(error) {
  return error.id === "API_ERROR";
}

function isAuthorizationError(error) {
  return error.status === 403 || error.status === 401;
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

function fatalAuthorizationError(error, method) {
  return fatalErrorActions.setFatalError(
    {
      heading: error.title,
      body: error.detail,
      status: error.status,
      method,
      project: error.project
    },
    fatalErrorActions.types.authorization
  );
}

function redirectIfUnauthorized(dispatch, action) {
  const errors = apiErrors(action);
  if (errors.length === 0) return;
  errors.forEach(error => {
    if (isAuthorizationError(error)) {
      const method = get(action, "payload.request.method");
      return dispatch(fatalAuthorizationError(error, method));
    }
  });
}

function notifyIfOtherApiError(dispatch, action) {
  const errors = apiErrors(action);
  if (errors.length === 0) return;
  errors.forEach(error => {
    if (isAuthorizationError(error)) return;
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
  dispatch(
    fatalErrorActions.setFatalError(fatalError, fatalErrorActions.types.api)
  );
}

export default function entityStoreMiddleware({ dispatch, getStateIgnored }) {
  return next => action => {
    if (!isApiResponse(action)) return next(action);
    if (get(action, "payload.suppressErrors")) return next(action);

    redirectIfUnauthorized(dispatch, action);
    notifyIfOtherApiError(dispatch, action);
    checkForFatalErrors(dispatch, action);
    return next(action);
  };
}
