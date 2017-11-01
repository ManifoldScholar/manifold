import { handleActions } from "redux-actions";

const initialState = {
  colorScheme: "light"
};

const setColorScheme = (state, action) => {
  return Object.assign({}, state, { colorScheme: action.payload });
};

const setPersistentUI = (state, action) => {
  return Object.assign({}, state, action.payload.colors);
};

export default handleActions(
  {
    SET_PERSISTENT_UI: setPersistentUI,
    SET_COLOR_SCHEME: setColorScheme
  },
  initialState
);
