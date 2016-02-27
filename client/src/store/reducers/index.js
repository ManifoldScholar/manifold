import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import collections from './collections';
import error from './error';
import ui from './ui';
import authentication from './authentication';
import isomorphic from './isomorphic';

const routing = routerReducer;
const reducers = combineReducers({
  collections,
  error,
  ui,
  routing,
  authentication,
  isomorphic
});
export default reducers;
