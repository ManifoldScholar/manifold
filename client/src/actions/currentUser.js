import { createAction } from "redux-actions";

// The login hash can be an auth token (string) or a an { email, password } object.
export const login = createAction("LOGIN", loginHash => loginHash);

// Fired when login begins
export const loginStart = createAction("LOGIN_START");

// Fired when login is completed
export const loginComplete = createAction("LOGIN_COMPLETE");

// Notification payload
export const loginSetError = createAction(
  "LOGIN_SET_ERROR",
  notification => notification
);

// No payload necessary
export const logout = createAction("LOGOUT");

// A user model or promise returned from the API
export const setCurrentUser = createAction(
  "LOGIN_SET_CURRENT_USER",
  user => user
);

// Auth token is a string
export const setAuthToken = createAction(
  "LOGIN_SET_AUTH_TOKEN",
  authToken => authToken
);

// A user model or promise returned from the API
export const updateCurrentUser = createAction(
  "UPDATE_CURRENT_USER",
  user => user
);

// A user model or promise returned from the API
export const replaceUserCollection = createAction(
  "REPLACE_USER_COLLECTION",
  collection => collection
);

export const setVisitToken = createAction(
  "LOGIN_SET_VISIT_TOKEN",
  visitToken => visitToken
);

export const setVisitorToken = createAction(
  "LOGIN_SET_VISITOR_TOKEN",
  visitorToken => visitorToken
);

export default {
  login,
  loginStart,
  loginComplete,
  loginSetError,
  logout,
  setCurrentUser,
  setAuthToken,
  setVisitToken,
  setVisitorToken,
  updateCurrentUser,
  replaceUserCollection
};
