import { ApiClient } from 'api';
import get from 'lodash/get';

function sendRequest(request, authToken) {
  const client = new ApiClient;
  const token = authToken;
  const { endpoint, method, options } = request;
  options.authToken = token;
  return client.call(endpoint, method, options);
}

function buildResponseAction(payload, meta, error) {
  const type = `API_RESPONSE/${meta.toUpperCase().replace(/-/g, '_')}`;
  return { type, error, payload, meta };
}

export default function entityStoreMiddleware({ dispatch, getState }) {
  return (next) => (action) => {

    // Guards
    if (action.type !== 'API_REQUEST') {
      return next(action);
    }
    if (action.payload.state !== 0) return next(action);

    const state = getState();

    // If it's a one time request, we treat it as a noop and do not send it again.
    if (action.payload.oneTime === true
      && get(state, `entityStore.responses.${action.meta}.loaded`) === true) {
      return next(action);
    }

    // Inject headers, etc. from state
    const requestPromise =
      sendRequest(action.payload.request, state.authentication.authToken);

    // Start and stop loading indication based on this promise.
    dispatch({ type: 'START_LOADING', payload: action.meta });
    requestPromise.then(() => {
      dispatch({ type: 'STOP_LOADING', payload: action.meta });
    }, () => {
      dispatch({ type: 'STOP_LOADING', payload: action.meta });
    }).catch(() => {
      dispatch({ type: 'STOP_LOADING', payload: action.meta });
    });

    // Pass through the request action with updated state
    // We add the promise to the payload so that it can be used in fetch data to delay
    // loading.
    const withState = { state: 1, promise: requestPromise };
    const newPayload = Object.assign({}, action.payload, withState);

    let newMeta = action.meta;
    if (!Array.isArray(newMeta)) newMeta = [action.meta];

    newMeta.forEach((meta) => {
      const type = `API_REQUEST/${meta.toUpperCase().replace(/-/g, '_')}`;
      const adjustedRequestAction = {
        type,
        payload: newPayload,
        meta
      };
      next(adjustedRequestAction);
    });

    // Execute the API call and when it is complete, dispatch a response action.
    requestPromise.then((response) => {
      newMeta.forEach((meta) => {
        dispatch(buildResponseAction(response, meta, false));
      });
    }, (response) => {
      newMeta.forEach((meta) => {
        dispatch(buildResponseAction(response, meta, true));
      });
    });
    return { meta: action.meta, promise: requestPromise };
  };
}
