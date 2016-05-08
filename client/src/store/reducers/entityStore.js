import { handleActions } from 'redux-actions';

const initialState = {
  responses: {},
  entities: {}
};

const mergeEntities = (stateEntities, payloadEntities) => {
  const mergedEntities = {};
  Object.keys(payloadEntities).forEach((key) => {
    mergedEntities[key] = Object.assign({}, stateEntities[key], payloadEntities[key]);
  });
  return Object.assign({}, stateEntities, mergedEntities);
};

function errorResponse(state, action) {
  // TODO: Handle errors, damnit!
}

function successResponse(state, action) {
  const meta = action.meta;
  const isCollection = Array.isArray(action.payload.results);
  const responses = Object.assign({}, state.responses, {
    [meta]: {
      entity: !isCollection ? action.payload.results : null,
      collection: isCollection ? action.payload.results : null,
      loaded: true
    }
  });
  const entities = mergeEntities(state.entities, action.payload.entities);
  return Object.assign({}, state, { responses, entities });
}

function handleResponse(state, action) {
  const isError = action.error === true;
  return isError ? errorResponse(state, action) : successResponse(state, action);
}

function handleRequest(state, action) {
  const meta = action.meta;
  if (state.responses[meta]) return state;
  const responses = Object.assign({}, state.responses, {
    [meta]: {
      entities: null,
      loaded: false
    }
  });
  return Object.assign({}, state, { responses });
}

function handleFlush(state, action) {
  const metasToFlush = action.payload;
  const responses = Object.assign({}, state.responses);
  metasToFlush.forEach((meta) => {
    delete responses[meta];
  });
  let entities = state.entities;
  if (Object.keys(responses).length === 0) {
    entities = {};
  }
  return Object.assign({}, state, { responses, entities });
}


export default handleActions({
  ENTITY_STORE_REQUEST: handleRequest,
  ENTITY_STORE_RESPONSE: handleResponse,
  ENTITY_STORE_FLUSH: handleFlush
}, initialState);
