import { createAction } from 'redux-actions';
import { tokensAPI, usersAPI } from '../../api';
import createApiAction from '../helpers/createApiAction';
import { addNotification, removeNotification } from './notifications';

export const actions = {
  START_LOGIN: 'START_LOGIN',
  START_LOGOUT: 'START_LOGOUT',
  SET_AUTH_TOKEN: 'SET_AUTH_TOKEN',
  SET_USER: 'SET_USER',
  WHOAMI: 'WHOAMI'
};

const logout = createAction(actions.START_LOGOUT);
const notificationId = 'LOGIN_NOTIFICATION';

export const setAuthToken = createAction(actions.SET_AUTH_TOKEN);
export const whoami = createApiAction(actions.WHOAMI, usersAPI.whoami);

// I have some doubts about whether this is the best spot for this logic. Could be easier
// to trace if we had some authentication middleware that saw the token get set, then
// dispatched the other actions (set user, set auth token)
export function startLogin(email, password) {
  return (dispatch, getStateIgnored) => {
    dispatch(createAction(actions.START_LOGIN)());
    const promise = tokensAPI.createToken(email, password);
    promise.then((response) => {
      const authToken = response.authToken;
      const user = response.user;
      const expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + 90);
      document.cookie = `authToken=${authToken};path=/;expires=${expireDate.toUTCString()}`;
      dispatch(removeNotification(notificationId));
      dispatch(createAction(actions.SET_USER)(user));
      dispatch(createAction(actions.SET_AUTH_TOKEN)(authToken));
    }, (response) => {
      const heading = 'Login Failed';
      let level;
      let body;
      switch (response.status) {
        case 502:
          level = 2;
          body = 'The server was unreachable, or unable to fulfill your request. If' +
            ' you are sure that you are online, perhaps there is a problem with the Manifold ' +
            'backend';
          break;
        default:
          level = 1;
          body = 'The username or password you entered is incorrect';
          break;
      }
      dispatch(addNotification({ id: notificationId, level, heading, body }));
    });
  };
}

export function startLogout() {
  document.cookie = 'authToken=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT';
  return dispatch => {
    dispatch(logout());
  };
}
