import { handleActions } from "redux-actions";

const initialState = {
  language: "en"
};

const setLocale = (state, action) => {
  return { ...state, ...action.payload };
};

const setPersistentUI = (state, action) => {
  return { ...state, ...action.payload };
};

export default handleActions(
  {
    SET_PERSISTENT_UI: setPersistentUI,
    SET_LOCALE: setLocale
  },
  initialState
);
