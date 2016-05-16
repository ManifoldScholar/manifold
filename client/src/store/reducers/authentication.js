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

const updateStateFromUser = (state, user) => {
  const newState = {
    currentUser: user
  };
  return Object.assign({}, state, newState);
};

const syncCurrentUser = (state, action) => {
  if (action.meta === requests.updateCurrentUser) {
    return updateStateFromUser(state, action.payload.data);
  }
  return state;
};

const getCurrentUser = (state, action) => {
  // if we can't get the current user, we invalidate the token, etc.
  if (!action.payload || !action.payload.data) {
    return initialState;
  }
  return updateStateFromUser(state, action.payload.data);
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

export default handleActions({
  ENTITY_STORE_RESPONSE: syncCurrentUser,
  START_LOGIN: startLogin,
  START_LOGOUT: startLogout,
  SET_AUTH_TOKEN: setAuthToken,
  SET_CURRENT_USER: getCurrentUser,
  GET_CURRENT_USER: getCurrentUser,
  SET_AUTH_ERROR: setAuthError
}, initialState);
