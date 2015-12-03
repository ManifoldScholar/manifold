import {combineReducers} from 'redux';
import {routerStateReducer as router} from 'redux-router';
import collections from './collections';
import error from './error';
import ui from './ui';
import authentication from './authentication';

const reducers = combineReducers({collections, error, ui, router, authentication});
export default reducers;
