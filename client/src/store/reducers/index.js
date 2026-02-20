import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import ui from "./ui";
import notifications from "./notifications";
import authentication from "./authentication";
import fatalError from "./fatalError";
import oauth from "./oauth";
import isomorphic from "./isomorphic";
import developer from "./developer";
import entityStore from "./entityStore";
import entityEditor from "./entityEditor";
import websocket from "./websocket";

const routing = routerReducer;
const reducers = combineReducers({
  entityStore,
  entityEditor,
  ui,
  notifications,
  fatalError,
  routing,
  oauth,
  authentication,
  isomorphic,
  websocket,
  developer
});
export default reducers;
