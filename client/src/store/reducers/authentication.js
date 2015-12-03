import {handleActions} from 'redux-actions';

const initialState = {
  authenticated: false,
  authenticating: false,
  authToken: null,
  user: null
};

const startLogin = (state) => {
  return Object.assign({}, state, {authenticating: true});
};

const startLogout = () => {
  return Object.assign({}, initialState);
};

const setUser = (state, action) => {
  const user = action.payload;
  const newState = {user: user};
  return Object.assign({}, state, newState);
};

const setUserFromWhoami = (state, action) => {
  const users = action.payload.entities.users;
  const id = action.payload.results;
  const user = users[id];
  const newState = {user: Object.assign({}, {id: user.id}, user.attributes)};
  return Object.assign({}, state, newState);
};

const setAuthToken = (state, action) => {
  const authToken = action.payload;
  const newState = {authenticating: false, authenticated: true, authToken: authToken};
  return Object.assign({}, state, newState);
};

export default handleActions({
  START_LOGIN: startLogin,
  START_LOGOUT: startLogout,
  SET_AUTH_TOKEN: setAuthToken,
  SET_USER: setUser,
  WHOAMI: setUserFromWhoami
}, initialState);
