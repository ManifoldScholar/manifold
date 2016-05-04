import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from './middleware/thunkMiddleware';
import loadingMiddleware from './middleware/loadingMiddleware';
import { DevTools } from '../containers/shared';
import promiseMiddleware from 'redux-promise';
import reducers from './reducers';

export default function createStore(data) {

  const useDevTools = __DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__;
  const middleware = [];
  middleware.push(thunkMiddleware);
  middleware.push(loadingMiddleware);
  middleware.push(promiseMiddleware);

  let finalCreateStore;
  if (useDevTools) {
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      DevTools.instrument()
    )(_createStore);
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore);
  }

  const store = finalCreateStore(reducers, data);
  return store;
}
