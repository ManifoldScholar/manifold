import {combineReducers} from 'redux';
import {routerStateReducer as router} from 'redux-router';
import collections from './collections';
import error from './error';
import curtain from './curtain';
import ui from './ui';
import example from './example';

const reducers = combineReducers({collections, error, curtain, ui, router, example});
export default reducers;
