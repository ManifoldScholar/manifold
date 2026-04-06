import { handleActions } from "redux-actions";

const initialState = {
  colorScheme: "light",
  highContrast: false
};

const setColorScheme = (state, action) => {
  return { ...state, colorScheme: action.payload };
};

const setHighContrast = (state, action) => {
  return { ...state, highContrast: action.payload };
};

const setPersistentUI = (state, action) => {
  return { ...state, ...action.payload.colors };
};

export default handleActions(
  {
    SET_PERSISTENT_UI: setPersistentUI,
    SET_COLOR_SCHEME: setColorScheme,
    SET_HIGH_CONTRAST: setHighContrast
  },
  initialState
);
