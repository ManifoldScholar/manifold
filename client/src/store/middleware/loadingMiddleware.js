import { isPromise } from '../../utils/promise';

export default function loadingMiddleware({ dispatch }) {
  return next => action => {
    if (isPromise(action.payload)) {
      // Without timeout, we'll get a batch update invariant violation.
      // https://github.com/facebook/react/issues/2410
      // I expect this will be fixed at some point.
      setTimeout(() => {
        dispatch({ type: 'START_LOADING', payload: action.type });
      }, 0);
      Promise.all([action.payload]).then(() => {
        dispatch({ type: 'STOP_LOADING', payload: action.type });
      });
    }
    return next(action);
  };
}
