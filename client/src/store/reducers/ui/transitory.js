import { combineReducers } from "redux";
import filters from "./transitory/filters";
import loading from "./transitory/loading";
import reader from "./transitory/reader";
import search from "./transitory/search";
import stateSnapshots from "./transitory/stateSnapshots";
import visibility from "./transitory/visibility";
import frontendMode from "./transitory/frontendMode";

export default combineReducers({
  filters,
  loading,
  reader,
  search,
  stateSnapshots,
  visibility,
  frontendMode
});
