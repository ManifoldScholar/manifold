import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from './middleware/thunkMiddleware';
import entityStoreMiddleware from './middleware/entityStoreMiddleware';
import currentUserMiddleware from './middleware/currentUserMiddleware';
import notificationMiddleware from './middleware/notificationMiddleware';
import apiErrorMiddleware from './middleware/apiErrorMiddleware';
import websocketMiddleware from './middleware/websocketMiddleware';
import promiseMiddleware from 'redux-promise';
import reducers from './reducers';

export default function createStore(data) {

  const useDevTools = __DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__;
  const middleware = [];
  middleware.push(currentUserMiddleware);
  middleware.push(apiErrorMiddleware);
  middleware.push(entityStoreMiddleware);
  middleware.push(thunkMiddleware);
  middleware.push(promiseMiddleware);
  middleware.push(websocketMiddleware);
  middleware.push(notificationMiddleware);

  let finalCreateStore;
  if (__CLIENT__) {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    finalCreateStore = composeEnhancers(
      applyMiddleware(...middleware)
    )(_createStore);
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore);
  }

  let devtoolsExtension = null;
  if (__CLIENT__) {
    devtoolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__();
  }

  const store = finalCreateStore(
    reducers,
    data
  );
  return store;
}
