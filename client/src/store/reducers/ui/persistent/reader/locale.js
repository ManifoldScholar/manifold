import { handleActions } from "redux-actions";

const initialState = {
  language: "en"
};

const setLocale = (state, action) => {
  return { ...state, ...action.payload.locale };
};

const setPersistentUI = (state, action) => {
  return { ...state, ...action.payload.locale };
};

export default handleActions(
  {
    SET_PERSISTENT_UI: setPersistentUI,
    SET_LOCALE: setLocale
  },
  initialState
);
