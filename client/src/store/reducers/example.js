import {handleActions} from 'redux-actions';

const initialState = {
  collection: []
};

const push = (state, action) => {
  return Object.assign({}, state, {
    collection: [...state.collection, action.payload]
  });
};

const pop = (state, actionIgnored) => {
  const items = [...state.collection];
  items.pop();
  return Object.assign({}, state, {
    collection: items
  });
};

export default handleActions({
  PUSH_EXAMPLE_COLLECTION: push,
  POP_EXAMPLE_COLLECTION: pop
}, initialState);
