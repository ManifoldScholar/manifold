import { handleActions } from 'redux-actions';
import update from 'immutability-helper';
import cloneDeep from 'lodash/cloneDeep';
import lodashSet from 'lodash/set';

const initialState = {
  sessions: {}
};

const open = (state, action) => {
  const { key, model } = action.payload;
  const newSession = {
    dirty: cloneDeep(model),
    source: model,
    changed: false,
  };
  return update(state, { sessions: { [key]: { $set: newSession } } });
};

const close = (state, action) => {
  const key = action.payload;
  const newSessions = Object.assign({}, state.sessions);
  delete newSessions[key];
  return update(state, { sessions: { $set: newSessions } });
};

const set = (state, action) => {
  const { path, id, value } = action.payload;
  const setPath = lodashSet({}, path, value);
  const newSession = update(state.sessions[id].dirty, setPath);
  return update(state, { sessions: { [id]: {
    changed: { $set: true },
    dirty: { $set: newSession }
  } } });
};

const startAction = (state, dispatchedAction) => {
  const { id, action } = dispatchedAction.payload;
  return update(state, { sessions: { [id]: { pendingAction: { $set: action } } } });
};

const completeAction = (state, dispatchedAction) => {
  const { id } = dispatchedAction.payload;
  return update(state, { sessions: { [id]: { pendingAction: { $set: null } } } });
};

export default handleActions({
  ENTITY_EDITOR_OPEN: open,
  ENTITY_EDITOR_CLOSE: close,
  ENTITY_EDITOR_SET: set,
  ENTITY_EDITOR_PENDING_ACTION: startAction,
  ENTITY_EDITOR_COMPLETE_ACTION: completeAction
}, initialState);
