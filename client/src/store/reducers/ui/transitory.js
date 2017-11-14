import { combineReducers } from "redux";
import filters from "./transitory/filters";
import loading from "./transitory/loading";
import reader from "./transitory/reader";
import visibility from "./transitory/visibility";

export default combineReducers({
  filters,
  loading,
  reader,
  visibility
});
