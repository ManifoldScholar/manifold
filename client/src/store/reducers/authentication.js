import { handleActions } from "redux-actions";
import { constantizeMeta } from "utils/entityUtils";
import { requests } from "api";

const initialState = {
  authenticated: false,
  authenticating: false,
  authToken: null,
  currentUser: null,
  error: null
};

const deleteFavorite = (state, action) => {
  if (action.error === true) return state;
  const favorites = Object.assign({}, state.currentUser.favorites);
  delete favorites[action.payload];
  const currentUser = Object.assign({}, state.currentUser, { favorites });
  return Object.assign({}, state, { currentUser });
};

const setError = (state, action) => {
  const error = action.payload;
  return Object.assign({}, state, { error });
};

const logout = () => {
  return Object.assign({}, initialState);
};

const setAuthToken = (state, action) => {
  const authToken = action.payload;
  if (!authToken) return state;
  const newState = { authToken };
  return Object.assign({}, state, newState);
};

const endLogin = state => {
  return Object.assign({}, state, { authenticating: false });
};

const startLogin = state => {
  return Object.assign({}, state, { authenticating: true });
};

const updateStateFromUser = (state, payload) => {
  const adjustedUser = Object.assign({}, payload.data);
  const favorites = {};
  if (payload.included) {
    payload.included
      .filter(inc => {
        return inc.type === "favorites";
      })
      .forEach(fave => {
        const id = fave.attributes.favoritableId;
        favorites[id] = fave;
      });
  }
  delete adjustedUser.relationships;
  adjustedUser.favorites = favorites;
  const newState = {
    currentUser: adjustedUser,
    authenticated: true,
    error: null
  };
  return Object.assign({}, state, newState);
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
    DELETE_CURRENT_USER_FAVORITE: deleteFavorite,
    LOGIN_SET_AUTH_TOKEN: setAuthToken,
    LOGIN_COMPLETE: endLogin,
    LOGIN_SET_ERROR: setError,
    LOGOUT: logout
  },
  initialState
);
