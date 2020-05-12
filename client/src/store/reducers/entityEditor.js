import { handleActions } from "redux-actions";
import update from "immutability-helper";
import lodashSet from "lodash/set";
import lodashGet from "lodash/get";
import endsWith from "lodash/endsWith";
import isNil from "lodash/isNil";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import isPlainObject from "lodash/isPlainObject";
import lodashUnset from "lodash/unset";
import flatMapDeep from "lodash/flatMapDeep";

const initialState = {
  sessions: {}
};

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

const hasKeysDeep = obj => {
  if (!isPlainObject(obj)) return false;
  const found = flatMapDeep(obj).find(entry => {
    return Object.keys(entry).length > 0;
  });
  return found !== undefined;
};

const hasKeys = obj => {
  if (!isPlainObject(obj)) return false;
  return Object.keys(obj).length > 0;
};

const makeComparableCollection = collection => {
  return collection.map(entity => {
    if (entity.hasOwnProperty("id")) return entity.id;
    return entity;
  });
};

const hasIdentity = value => {
  return isPlainObject(value) && value.hasOwnProperty("id");
};

const isResourcish = value => {
  return (
    isPlainObject(value) &&
    (value.hasOwnProperty("attributes") ||
      value.hasOwnProperty("relationships"))
  );
};

const isAttachmentStyles = (property, value) => {
  if (!isPlainObject(value)) return false;
  return endsWith(property, "Styles");
};

const areCollectionsEqualish = (a, b) => {
  return isEqual(makeComparableCollection(a), makeComparableCollection(b));
};

const areObjectsEqualish = (a, b) => {
  if (hasIdentity(a) && hasIdentity(b)) return a.id === b.id;
  return a === b;
};

const areValuesEqualish = (a, b) => {
  if (Array.isArray(a)) return areCollectionsEqualish(a, b);
  if (isPlainObject(a)) return areObjectsEqualish(a, b);
  if (a === "" && isNil(b)) return true;
  return a === b;
};

const relationshipChanged = (a, b) => {
  if (Array.isArray(a)) {
    return !areCollectionsEqualish(a, b);
  } else {
    return areObjectsEqualish(a, b);
  }
};

const anyRelationshipChanged = (dirty, source) => {
  if (
    !isPlainObject(dirty.relationships) ||
    !isPlainObject(source.relationships)
  )
    return false;
  return Object.keys(dirty.relationships).some(relationship => {
    return relationshipChanged(
      dirty.relationships[relationship],
      source.relationships[relationship]
    );
  });
};

const hasChanges = (dirty, source) => {
  if (isResourcish(dirty)) {
    if (hasKeys(dirty.attributes)) return true;
    return anyRelationshipChanged(dirty, source);
  } else {
    return hasKeysDeep(dirty);
  }
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
  const newSessions = { ...state.sessions, [key]: newSession };
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

  // Remove attributes form dirty model when...
  Object.keys(dirty.attributes).forEach(property => {
    if (
      // The source and dirty values are equal...
      areValuesEqualish(
        dirty.attributes[property],
        model.attributes[property]
      ) ||
      // Or the property only exists in the dirty model (eg, removeAvatar)
      !model.attributes.hasOwnProperty(property) ||
      // Or when it's an attachment styles property
      isAttachmentStyles(property, model.attributes[property])
    )
      delete dirty.attributes[property];
  });

  // Delete relationships that are the same.
  Object.keys(dirty.relationships).forEach(property => {
    if (
      relationshipChanged(
        dirty.relationships[property],
        model.relationships[property]
      )
    )
      delete dirty.relationships[property];
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
  const session = state.sessions[id];
  if (!session) return;
  const sourceValue = getSourceValue(path, session.source);
  const dirty = { ...state.sessions[id].dirty };
  let newDirty;

  // If the new value matches the source value, we unset it in dirty.
  if (areValuesEqualish(value, sourceValue)) {
    const target = setPathToGetPath(path);
    lodashUnset(dirty, target);
    // If we're dealing with a nested hash, than we may need to unset the parent as well.
    // For example, without this, metadata hashes will always trigger dirty.
    const depth = target.split(".").length;
    if (depth > 2) {
      const parentPath = target.substr(0, target.lastIndexOf("."));
      const parent = lodashGet(dirty, parentPath);
      if (isPlainObject(parent) && Object.keys(parent).length === 0) {
        lodashUnset(dirty, parentPath);
      }
    }
    newDirty = dirty;
  } else {
    lodashSet(dirty, setPathToGetPath(path), null);
    newDirty = update(dirty, setPath);
  }
  let changed;
  if (action.payload.triggersDirty) {
    changed = hasChanges(newDirty, session.source);
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
