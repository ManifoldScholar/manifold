import { isPromise } from '../../utils/promise';

export default function loadingMiddleware({ dispatch }) {
  return next => action => {
    if (isPromise(action.payload) && !action.error && __CLIENT__) {
      // Without timeout, we'll get a batch update invariant violation.
      // https://github.com/facebook/react/issues/2410
      // I expect this will be fixed at some point.
      dispatch({ type: 'START_LOADING', payload: action.type });
      Promise.all([action.payload]).then(() => {
        dispatch({ type: 'STOP_LOADING', payload: action.type });
      }, () => {
        dispatch({ type: 'STOP_LOADING', payload: action.type });
      }).catch(() => {
        dispatch({ type: 'STOP_LOADING', payload: action.type });
      });
    }
    return next(action);
  };
}
