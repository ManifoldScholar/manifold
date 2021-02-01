import { combineReducers } from "redux";
import locale from "./persistent/locale";
import reader from "./persistent/reader";

export default combineReducers({
  locale,
  reader
});
