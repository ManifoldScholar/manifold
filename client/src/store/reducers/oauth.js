import { handleActions } from "redux-actions";

const initialState = {
  started: false,
  popup: null,
  errors: null
};

function oauthStarted(state, { payload }) {
  const { popup } = payload;

  return { ...state, popup, started: true, errors: null };
}

function oauthCancelled(state) {
  return { ...state, popup: null, started: false };
}

function oauthFailed(state, { payload }) {
  const { errors } = payload;

  return { ...state, errors };
}

function oauthDone(state) {
  return { ...state, started: false };
}

export default handleActions(
  {
    OAUTH_START: oauthStarted,
    OAUTH_RESPONSE: oauthDone,
    OAUTH_FAILURE: oauthFailed,
    OAUTH_CANCEL: oauthCancelled
  },
  initialState
);
