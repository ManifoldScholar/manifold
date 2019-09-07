import { combineReducers } from "redux";
import colors from "./reader/colors";
import readingGroups from "./reader/readingGroups";
import typography from "./reader/typography";

export default combineReducers({ colors, typography, readingGroups });
