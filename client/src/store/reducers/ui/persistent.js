import { combineReducers } from "redux";
import reader from "./persistent/reader";
import standaloneMode from "./persistent/standaloneMode";

export default combineReducers({
  reader,
  standaloneMode
});
