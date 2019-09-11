import { handleActions } from "redux-actions";

const getInitialState = () => ({
  currentReadingGroup: "public"
});

const setReadingGroup = (state, action) => {
  return { ...state, currentReadingGroup: action.payload };
};

const resetReadingGroup = () => {
  return getInitialState();
};

const setPersistentUI = (state, action) => {
  return { ...getInitialState(), ...action.payload.readingGroups };
};

export default handleActions(
  {
    SET_PERSISTENT_UI: setPersistentUI,
    SET_READING_GROUP: setReadingGroup,
    LOGOUT: resetReadingGroup
  },
  getInitialState()
);
