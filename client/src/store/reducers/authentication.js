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

const setCurrentUser = (state, action) => {
  const currentUser = action.payload;
  const newState = { currentUser };
  return Object.assign({}, state, newState);
};

const getCurrentUser = (state, action) => {
  if (!action.payload || !action.payload.data) return state;
  const currentUser = action.payload.data;
  const newState = {
    currentUser: Object.assign(
      {},
      { id: currentUser .id },
      currentUser .attributes
    )
  };
  return Object.assign({}, state, newState);
};

const setAuthToken = (state, action) => {
  const authToken = action.payload;
  const newState = { authenticating: false, authenticated: true, authToken };
  return Object.assign({}, state, newState);
};

const setAuthError = (state, action) => {
  const error = action.payload;
  return Object.assign({}, state, { error });
};

const syncCurrentUser = (state, action) => {
  if (action.meta === requests.updateCurrentUser) {
    const currentUser = action.payload.data;
    const newState = {
      currentUser: Object.assign(
        {},
        { id: currentUser .id },
        currentUser .attributes
      )
    };
    return Object.assign({}, state, newState);
  }
  return state;
};

export default handleActions({
  ENTITY_STORE_RESPONSE: syncCurrentUser,
  START_LOGIN: startLogin,
  START_LOGOUT: startLogout,
  SET_AUTH_TOKEN: setAuthToken,
  SET_CURRENT_USER: setCurrentUser,
  GET_CURRENT_USER: getCurrentUser,
  SET_AUTH_ERROR: setAuthError
}, initialState);
