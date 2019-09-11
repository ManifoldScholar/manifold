import { handleActions } from "redux-actions";

const initialState = {};

const takeSnapshot = (state, action) => {
  const { key, snapshot } = action.payload;
  return { ...state, [key]: snapshot };
};

const resetSnapshot = (state, action) => {
  const key = action.payload;
  const newState = { ...state };
  delete newState[key];
  return newState;
};

const resetSnapshots = (stateIgnored, actionIgnored) => {
  return {};
};

export default handleActions(
  {
    TAKE_SNAPSHOT: takeSnapshot,
    RESET_SNAPSHOT: resetSnapshot,
    RESET_SNAPSHOTS: resetSnapshots
  },
  initialState
);
