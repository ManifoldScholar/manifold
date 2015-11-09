import {handleActions} from 'redux-actions';
import {timestamp} from '../../utils/time';
import {camelize} from 'humps';

const initialState = {
  results: {},
  entities: {}
};

const fetch = {
  next(state, action) {
    const time = new Date();
    const actionKey = camelize(action.type.toLowerCase());
    const fetchResults = {
      [actionKey]: {
        entities: action.payload.result,
        receivedAt: timestamp(time)
      }
    };
    const results = Object.assign({}, state.results, fetchResults);
    const entities = Object.assign({}, state.entities, action.payload.entities);
    return Object.assign({}, state, {results, entities});
  }
};

export default handleActions({
  FETCH_TEXTS: fetch,
  FETCH_ONE_TEXT: fetch
}, initialState);
