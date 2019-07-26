import { createAction } from "redux-actions";

export const setMode = createAction(
  "SET_FRONTEND_MODE",
  (mode, project, search) => ({ mode, project, search })
);

export const setFrontendModeToLibrary = createAction(
  "SET_FRONTEND_MODE_LIBRARY"
);

export const setFrontendModeToStandalone = createAction(
  "SET_FRONTEND_MODE_STANDALONE",
  (project) => project
);

