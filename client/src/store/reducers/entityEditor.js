import { handleActions } from 'redux-actions';
import update from 'immutability-helper';
import cloneDeep from 'lodash/cloneDeep';
import lodashSet from 'lodash/set';
import lodashGet from 'lodash/get';
import lodashOmit from 'lodash/omit';
import flatMapDeep from 'lodash/flatMapDeep';

const initialState = {
  sessions: {}
};

// Begin helper methods

const setPathToGetPath = (path) => {
  const parts = path.split('.');
  parts.pop();
  const getPath = parts.join('.');
  return getPath;
};

const getSourceValue = (setPath, model) => {
  const value = lodashGet(model, setPathToGetPath(setPath));
  return value;
};

const hasChanges = (model) => {
  const found = flatMapDeep(model).find((obj) => { return Object.keys(obj).length > 0; });
  return found !== undefined;
};

// End helper methods

const open = (state, action) => {
  const { key, model } = action.payload;
  const newSession = {
    dirty: {
      attributes: {},
      relationships: {}
    },
    source: model,
    changed: false,
  };
  const newSessions = Object.assign({}, state.session, { [key]: newSession });
  const newState = Object.assign({}, state, { sessions: newSessions });
  return newState;
};

const close = (state, action) => {
  const key = action.payload;
  const newSessions = Object.assign({}, state.sessions);
  delete newSessions[key];
  return update(state, { sessions: { $set: newSessions } });
};

const set = (state, action) => {
  const { path, id, value } = action.payload;
  if (value === undefined) return state; // undefined values are noops.
  const setPath = lodashSet({}, path, value);
  const sourceValue = getSourceValue(path, state.sessions[id].source);
  const dirty = cloneDeep(state.sessions[id].dirty);
  let newDirty;
  if (value === sourceValue) {
    newDirty = lodashOmit(dirty, setPathToGetPath(path));
  } else {
    lodashSet(dirty, setPathToGetPath(path), null);
    newDirty = update(dirty, setPath);
  }
  let changed;
  if (action.payload.triggersDirty) {
    changed = hasChanges(newDirty);
  } else {
    changed = lodashGet(state, `${id}.changed`) || false;
  }
  return update(state, { sessions: { [id]: {
    changed: { $set: changed },
    dirty: { $set: newDirty }
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
