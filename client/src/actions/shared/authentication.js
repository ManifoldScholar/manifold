import {createAction} from 'redux-actions';
import {tokensAPI, usersAPI} from '../../api';
import createApiAction from '../helpers/createApiAction';

export const actions = {
  START_LOGIN: 'START_LOGIN',
  START_LOGOUT: 'START_LOGOUT',
  SET_AUTH_TOKEN: 'SET_AUTH_TOKEN',
  SET_USER: 'SET_USER',
  WHOAMI: 'WHOAMI'
};

const logout = createAction(actions.START_LOGOUT);

export const setAuthToken = createAction(actions.SET_AUTH_TOKEN);
export const whoami = createApiAction(actions.WHOAMI, usersAPI.whoami);


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
      dispatch(createAction(actions.SET_USER)(user));
      dispatch(createAction(actions.SET_AUTH_TOKEN)(authToken));
    });
  };
}

export function startLogout() {
  document.cookie = 'authToken=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT';
  return dispatch => {
    dispatch(logout());
  };
}
