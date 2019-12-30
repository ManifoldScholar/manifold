import { handleActions } from "redux-actions";
import update from "immutability-helper";
import lodashSet from "lodash/set";
import lodashGet from "lodash/get";
import isEmpty from "lodash/isEmpty";
import lodashUnset from "lodash/unset";
import flatMapDeep from "lodash/flatMapDeep";

const initialState = {
  sessions: {}
};

// Begin helper methods

const setPathToGetPath = path => {
  const parts = path.split(".");
  parts.pop();
  const getPath = parts.join(".");
  return getPath;
};

const getSourceValue = (setPath, model) => {
  const value = lodashGet(model, setPathToGetPath(setPath));
  return value;
};

const hasChanges = model => {
  const found = flatMapDeep(model).find(obj => {
    return Object.keys(obj).length > 0;
  });
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
    changed: false
  };
  const newSessions = { ...state.session, [key]: newSession };
  const newState = { ...state, sessions: newSessions };
  return newState;
};

const refresh = (state, action) => {
  const { key, model } = action.payload;
  const existingSession = state.sessions[key];
  if (!existingSession) return open(state, action);

  const dirty = {
    attributes: { ...existingSession.dirty.attributes },
    relationships: { ...existingSession.dirty.relationships }
  };

  ["attributes", "relationships"].forEach(type => {
    Object.keys(dirty[type]).forEach(property => {
      if (dirty[type][property] === model[type][property])
        delete dirty[type][property];
    });
  });

  const newSession = {
    dirty,
    source: model,
    changed: !(isEmpty(dirty.attributes) && isEmpty(dirty.attributes))
  };
  const newSessions = { ...state.session, [key]: newSession };
  const newState = { ...state, sessions: newSessions };
  return newState;
};

const close = (state, action) => {
  const key = action.payload;
  const newSessions = { ...state.sessions };
  delete newSessions[key];
  return update(state, { sessions: { $set: newSessions } });
};

const removeChangedFlag = (state, action) => {
  const { entity } = action.payload;
  if (!entity) return state;
  const id = entity.id;
  const clear = {};
  Object.keys(state.sessions).forEach(sessionKey => {
    const source = state.sessions[sessionKey].source;
    if (source && source.id && source.id === id) {
      clear[sessionKey] = true;
    }
  });
  if (clear.length === 0) return state;
  let newState = { ...state };
  Object.keys(clear).forEach(sessionKey => {
    newState = update(newState, {
      sessions: {
        [sessionKey]: {
          changed: { $set: false }
        }
      }
    });
  });
  return newState;
};

const set = (state, action) => {
  const { path, id, value } = action.payload;
  if (value === undefined) return state; // undefined values are noops.
  const setPath = lodashSet({}, path, value);
  const sourceValue = getSourceValue(path, state.sessions[id].source);
  const dirty = { ...state.sessions[id].dirty };
  let newDirty;
  if (value === sourceValue) {
    lodashUnset(dirty, setPathToGetPath(path));
    newDirty = dirty;
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
  return update(state, {
    sessions: {
      [id]: {
        changed: { $set: changed },
        dirty: { $set: newDirty }
      }
    }
  });
};

const startAction = (state, dispatchedAction) => {
  const { id, action } = dispatchedAction.payload;
  return update(state, {
    sessions: { [id]: { pendingAction: { $set: action } } }
  });
};

const completeAction = (state, dispatchedAction) => {
  const { id } = dispatchedAction.payload;
  return update(state, {
    sessions: { [id]: { pendingAction: { $set: null } } }
  });
};

export default handleActions(
  {
    ENTITY_EDITOR_OPEN: open,
    ENTITY_EDITOR_REFRESH: refresh,
    ENTITY_EDITOR_CLOSE: close,
    ENTITY_EDITOR_SET: set,
    ENTITY_EDITOR_PENDING_ACTION: startAction,
    ENTITY_EDITOR_COMPLETE_ACTION: completeAction,
    ENTITY_STORE_REMOVE: removeChangedFlag
  },
  initialState
);
