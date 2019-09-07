import { handleActions } from "redux-actions";

const initialState = {
  currentReadingGroup: "public"
};

const setReadingGroup = (state, action) => {
  return Object.assign({}, state, { currentReadingGroup: action.payload });
};

const resetReadingGroup = () => {
  return initialState;
};

export default handleActions(
  {
    SET_READING_GROUP: setReadingGroup,
    LOGOUT: resetReadingGroup
  },
  initialState
);
