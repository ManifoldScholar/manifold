import {handleActions} from 'redux-actions';
import {timestamp} from '../../utils/time';
import {camelize} from 'humps';
import {actions} from '../../actions/shared/collections';

const collectionActions = Object.values(actions);
export const collectionEntities = ['texts', 'projects', 'makers'];

const resultsTemplate = { entities: [], query: {}, receivedAt: null};

const initialResults = {};
collectionActions.forEach((action) => {
  initialResults[camelize(action.toLowerCase())] = Object.assign({}, resultsTemplate);
});

const initialEntities = {};
collectionEntities.forEach((entity) => {
  initialEntities[entity] = {};
});

const initialState = {
  results: initialResults,
  entities: initialEntities
};

const mergeEntities = (stateEntities, payloadEntities) => {
  const entities = {};
  Object.keys(payloadEntities).forEach((key) => {
    entities[key] = Object.assign({}, stateEntities[key], payloadEntities[key]);
  });
  return entities;
};

const fetch = {
  next(state, action) {
    const time = new Date();
    const actionKey = camelize(action.type.toLowerCase());
    const results = {
      entities: action.payload.results,
      receivedAt: timestamp(time)
    };
    const fetchResults = {
      [actionKey]: Object.assign({}, resultsTemplate, results)
    };

    const newState = {
      results: Object.assign({}, state.results, fetchResults),
      entities: Object.assign({}, state.entities, mergeEntities(state.entities, action.payload.entities))
    };
    return Object.assign({}, state, newState);
  },
  throw(state, actionIgnored) {
    // TODO: Think about how to handle failures.
    // This should be called if the API promise fails.
    return state;
  }
};

const handlers = {};
collectionActions.forEach((action) => {
  handlers[action] = fetch;
});

handlers.START_LOGOUT = {
  next(stateIgnored, actionIgnored) {
    return Object.assign({}, initialState);
  }
};

export default handleActions(handlers, initialState);
