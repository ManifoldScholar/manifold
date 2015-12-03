import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import transitionMiddleware from './middleware/transitionMiddleware';
import thunkMiddleware from './middleware/thunkMiddleware';
import {DevTools} from '../containers/shared';
import createLogger from 'redux-logger';
import promiseMiddleware from 'redux-promise';

export default function createStore(reduxReactRouter, getRoutes, createHistory, data) {

  const middleware = [thunkMiddleware, promiseMiddleware, transitionMiddleware];

  if (__DEVELOPMENT__ && __CLIENT__) {
    const logger = createLogger({
      logger: console
    });
    middleware.push(logger);
  }

  let finalCreateStore;
  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
    const { persistState } = require('redux-devtools');
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(_createStore);
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore);
  }

  finalCreateStore = reduxReactRouter({ getRoutes, createHistory })(finalCreateStore);

  const reducer = require('./reducers');
  const store = finalCreateStore(reducer, data);

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(require('./reducers'));
    });
  }

  return store;
}
