import { handleActions } from "redux-actions";

const initialState = {
  project: {}
};

const setProjectFilters = (state, action) => {
  return { ...state, project: action.payload };
};

export default handleActions(
  {
    SET_PROJECT_FILTERS: setProjectFilters
  },
  initialState
);
