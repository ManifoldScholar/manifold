import { combineReducers } from "redux";
import loading from "./transitory/loading";
import stateSnapshots from "./transitory/stateSnapshots";
import visibility from "./transitory/visibility";

export default combineReducers({
  loading,
  stateSnapshots,
  visibility
});
