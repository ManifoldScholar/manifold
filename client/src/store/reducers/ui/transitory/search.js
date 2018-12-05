import { handleActions } from "redux-actions";

const initialState = {
  keyword: "",
  scope: null,
  facets: [],
  searchNum: 0
};

const setSearchQuery = (state, action) => {
  const newState = Object.assign({}, action.payload);
  newState.searchNum = state.searchNum + 1;
  return Object.assign({}, state, newState);
};

const resetSearch = () => {
  return Object.assign({}, initialState);
};

export default handleActions(
  {
    SET_SEARCH_QUERY: setSearchQuery,
    RESET_SEARCH: resetSearch
  },
  initialState
);
