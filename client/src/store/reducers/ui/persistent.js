import { combineReducers } from "redux";
import reader from "./persistent/reader";
import frontendMode from "./persistent/frontendMode";

export default combineReducers({
  reader,
  frontendMode
});
