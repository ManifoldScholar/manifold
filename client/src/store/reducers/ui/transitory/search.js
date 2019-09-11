import { handleActions } from "redux-actions";

const initialState = {
  keyword: "",
  scope: null,
  facets: [],
  searchNum: 0
};

const setSearchQuery = (state, action) => {
  const newState = { ...action.payload };
  newState.searchNum = state.searchNum + 1;
  return { ...state, ...newState };
};

const resetSearch = () => {
  return { ...initialState };
};

export default handleActions(
  {
    SET_SEARCH_QUERY: setSearchQuery,
    RESET_SEARCH: resetSearch
  },
  initialState
);
