import { combineReducers } from "redux";
import colors from "./reader/colors";
import locale from "./reader/locale";
import readingGroups from "./reader/readingGroups";
import typography from "./reader/typography";

export default combineReducers({ colors, locale, typography, readingGroups });
