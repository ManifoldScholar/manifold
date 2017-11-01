import { combineReducers } from "redux";
import persistent from "./ui/persistent";
import transitory from "./ui/transitory";

export default combineReducers({
  persistent,
  transitory
});
