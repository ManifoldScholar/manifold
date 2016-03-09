import { handleActions } from 'redux-actions';
import { timestamp } from '../../utils/time';
import { camelize } from 'humps';
import { actions } from '../../actions/shared/collections';
import { startsWith } from 'lodash/string';

const collectionActions = Object.values(actions);
export const collectionEntities = ['texts', 'projects', 'makers'];

const collectionResultsTemplate = { entities: [], query: {}, receivedAt: null };
const entityResultsTemplate = { entities: null, query: {}, receivedAt: null };

const initialResults = {};
collectionActions.forEach((action) => {
  const actionName = camelize(action.toLowerCase());
  const template = startsWith(actionName, 'fetchOne') ?
    entityResultsTemplate : collectionResultsTemplate;
  initialResults[actionName] = Object.assign({}, template);
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
    const resultsTemplate = startsWith(actionKey, 'fetchOne') ?
      entityResultsTemplate : collectionResultsTemplate;
    const results = {
      entities: action.payload.results,
      receivedAt: timestamp(time)
    };
    const fetchResults = {
      [actionKey]: Object.assign({}, resultsTemplate, results)
    };
    const newState = {
      results: Object.assign({}, state.results, fetchResults),
      entities: Object.assign(
        {},
        state.entities,
        mergeEntities(state.entities, action.payload.entities)
      )
    };
    return Object.assign({}, state, newState);
  },
  throw(state, actionIgnored) {
    return state;
  }
};

const handlers = {};
collectionActions.forEach((action) => {
  handlers[action] = fetch;
});


export default handleActions(handlers, initialState);
