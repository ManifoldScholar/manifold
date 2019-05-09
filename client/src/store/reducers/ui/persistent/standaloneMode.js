import { handleActions } from "redux-actions";

const initialState = {
  project: null
};

const setStandaloneMode = (state, action) => {
  return Object.assign({}, state, { project: action.payload });
};

export default handleActions(
  {
    SET_STANDALONE_MODE: setStandaloneMode
  },
  initialState
);
