import { combineReducers } from 'redux';
import { routeReducer } from 'redux-simple-router';
import collections from './collections';
import error from './error';
import ui from './ui';
import authentication from './authentication';
import isomorphic from './isomorphic';

const routing = routeReducer;
const reducers = combineReducers({collections, error, ui, routing, authentication, isomorphic});
export default reducers;
