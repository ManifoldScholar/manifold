import { handleActions } from 'redux-actions';
import { requests } from '../../actions/shared/entityStore';

const initialState = {
  authenticated: false,
  authenticating: false,
  authToken: null,
  currentUser: null,
  error: null
};

const startLogin = (state) => {
  return Object.assign({}, state, { authenticating: true });
};

const startLogout = () => {
  return Object.assign({}, initialState);
};

const updateStateFromUser = (state, payload) => {
  const adjustedUser = Object.assign({}, payload.data);
  const favorites = {};
  payload.included.filter((inc) => {
    return inc.type === 'favorites';
  }).forEach((fave) => {
    const id = fave.attributes.favoritableId;
    favorites[id] = fave;
  });
  delete adjustedUser.relationships;
  adjustedUser.favorites = favorites;
  const newState = {
    currentUser: adjustedUser
  };
  return Object.assign({}, state, newState);
};

const syncCurrentUser = (state, action) => {
  if (action.meta === requests.updateCurrentUser) {
    return updateStateFromUser(state, action.payload);
  }
  return state;
};

const getCurrentUser = (state, action) => {
  // if we can't get the current user, we invalidate the token, etc.
  if (!action.payload || !action.payload.data) {
    return initialState;
  }
  return updateStateFromUser(state, action.payload);
};

const setAuthToken = (state, action) => {
  const authToken = action.payload;
  if (!authToken) return state;
  const newState = { authenticating: false, authenticated: true, authToken };
  return Object.assign({}, state, newState);
};

const setAuthError = (state, action) => {
  const error = action.payload;
  return Object.assign({}, state, { error });
};

const follow = (state, action) => {
  if (action.error === true) return state;
  return updateStateFromUser(state, action.payload);
};

const unfollow = (state, action) => {
  if (action.error === true) return state;
  const favorites = Object.assign({}, state.currentUser.favorites);
  delete favorites[action.payload];
  const currentUser = Object.assign({}, state.currentUser, { favorites });
  return Object.assign({}, state, { currentUser });
};

export default handleActions({
  ENTITY_STORE_RESPONSE: syncCurrentUser,
  START_LOGIN: startLogin,
  START_LOGOUT: startLogout,
  SET_AUTH_TOKEN: setAuthToken,
  SET_CURRENT_USER: getCurrentUser,
  GET_CURRENT_USER: getCurrentUser,
  SET_AUTH_ERROR: setAuthError,
  FOLLOW: follow,
  UNFOLLOW: unfollow
}, initialState);
