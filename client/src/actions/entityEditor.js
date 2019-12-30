import { createAction } from "redux-actions";

export const refresh = createAction("ENTITY_EDITOR_REFRESH", (key, model) => {
  return { key, model };
});

export const open = createAction("ENTITY_EDITOR_OPEN", (key, model) => {
  return { key, model };
});

export const close = createAction("ENTITY_EDITOR_CLOSE", key => key);

export const startAction = createAction(
  "ENTITY_EDITOR_PENDING_ACTION",
  (id, action) => {
    return { id, action };
  }
);

export const completeAction = createAction(
  "ENTITY_EDITOR_COMPLETE_ACTION",
  (id, action) => {
    return { id, action };
  }
);

export const set = createAction(
  "ENTITY_EDITOR_SET",
  (id, path, value, triggersDirty = true) => {
    return { id, path, value, triggersDirty };
  }
);
