import { handleActions } from "redux-actions";

const getInitialState = () => ({
  currentReadingGroup: "public"
});

const setReadingGroup = (state, action) => {
  return Object.assign({}, state, { currentReadingGroup: action.payload });
};

const resetReadingGroup = () => {
  return getInitialState();
};

const setPersistentUI = (state, action) => {
  return Object.assign({}, getInitialState(), action.payload.readingGroups);
};

export default handleActions(
  {
    SET_PERSISTENT_UI: setPersistentUI,
    SET_READING_GROUP: setReadingGroup,
    LOGOUT: resetReadingGroup
  },
  getInitialState()
);
