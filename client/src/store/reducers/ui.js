import { combineReducers } from "redux";
import filters from "./ui/filters";
import colors from "./ui/colors";
import typography from "./ui/typography";
import visibility from "./ui/visibility";
import loading from "./ui/loading";
import reader from "./ui/reader";

export default combineReducers({
  filters,
  colors,
  typography,
  visibility,
  loading,
  reader
});
