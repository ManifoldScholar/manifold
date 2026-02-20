import { combineReducers } from "redux";
import loading from "./transitory/loading";
import reader from "./transitory/reader";
import stateSnapshots from "./transitory/stateSnapshots";
import visibility from "./transitory/visibility";

export default combineReducers({
  loading,
  reader,
  stateSnapshots,
  visibility
});
