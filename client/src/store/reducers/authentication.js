import { handleActions } from "redux-actions";
import { constantizeMeta } from "utils/entityUtils";
import { requests } from "api";
import update from "immutability-helper";

const initialState = {
  authenticated: false,
  authenticating: false,
  authToken: null,
  currentUser: null,
  error: null,
  visitToken: null,
  visitorToken: null
};

const setError = (state, action) => {
  const error = action.payload;
  return { ...state, error };
};

const setVisitToken = (state, action) => {
  const visitToken = action.payload;
  return { ...state, visitToken };
};

const setVisitorToken = (state, action) => {
  const visitorToken = action.payload;
  return { ...state, visitorToken };
};

const logout = () => {
  return { ...initialState };
};

const setAuthToken = (state, action) => {
  const authToken = action.payload;
  if (!authToken) return state;
  const newState = { authToken };
  return { ...state, ...newState };
};

const endLogin = state => {
  return {
    ...state,
    authenticating: false,
    authenticated: Boolean(state.authToken)
  };
};

const startLogin = state => {
  return { ...state, authenticating: true };
};

const replaceUserCollection = (state, action) => {
  if (!state.currentUser || !state.currentUser.relationships) return state;
  const newState = update(state, {
    currentUser: { relationships: { collection: { $set: action.payload } } }
  });
  return newState;
};

const updateStateFromUser = (state, payload) => {
  const adjustedUser = { ...payload.data };
  delete adjustedUser.relationships;
  adjustedUser.relationships = {
    collection: payload.included
      ? payload.included.find(inc => {
          return inc.type === "userCollections";
        })
      : null
  };
  const newState = {
    authenticated: !state.authenticating,
    currentUser: adjustedUser,
    error: null
  };
  return { ...state, ...newState };
};

const setCurrentUser = (state, action) => {
  // if we can't get the current user, we invalidate the token, etc.
  if (!action.payload) {
    return initialState;
  }
  return updateStateFromUser(state, action.payload);
};

const syncCurrentUser = (state, action) => {
  if (action.meta === requests.gAuthenticatedUserUpdate && !action.error) {
    return updateStateFromUser(state, action.payload);
  }
  return state;
};

export default handleActions(
  {
    [`API_RESPONSE/${constantizeMeta(
      requests.gAuthenticatedUserUpdate
    )}`]: syncCurrentUser,
    LOGIN: startLogin,
    LOGIN_SET_CURRENT_USER: setCurrentUser,
    UPDATE_CURRENT_USER: setCurrentUser,
    REPLACE_USER_COLLECTION: replaceUserCollection,
    LOGIN_SET_AUTH_TOKEN: setAuthToken,
    LOGIN_COMPLETE: endLogin,
    LOGIN_SET_ERROR: setError,
    LOGIN_SET_VISITOR_TOKEN: setVisitorToken,
    LOGIN_SET_VISIT_TOKEN: setVisitToken,
    LOGOUT: logout
  },
  initialState
);
