import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from './middleware/thunkMiddleware';
import { DevTools } from '../containers/shared';
import createLogger from 'redux-logger';
import promiseMiddleware from 'redux-promise';

export default function createStore(data, routerMiddleware) {

  const useDevTools = __DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__;

  const middleware = [];
  if (routerMiddleware) middleware.push(routerMiddleware);
  middleware.push(thunkMiddleware);
  middleware.push(promiseMiddleware);

  if (__DEVELOPMENT__ && __CLIENT__) {
    const logger = createLogger({
      logger: console
    });
    middleware.push(logger);
  }

  let finalCreateStore;
  if (useDevTools) {
    const { persistState } = require('redux-devtools');
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(_createStore);
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore);
  }

  const reducer = require('./reducers');
  const store = finalCreateStore(reducer, data);

  if (useDevTools && routerMiddleware) {
    routerMiddleware.listenForReplays(store);
  }

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(require('./reducers'));
    });
  }

  return store;
}
