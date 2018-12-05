import { createAction } from "redux-actions";

export const setSearchQuery = createAction(
  "SET_SEARCH_QUERY",
  searchQuery => searchQuery
);

export const resetSearch = createAction("RESET_SEARCH");
