import { createAction } from "redux-actions";

export const isProjectSubpage = createAction(
  "SET_FRONTEND_MODE_IS_PROJECT_SUBPAGE"
);

export const isProjectHomepage = createAction(
  "SET_FRONTEND_MODE_IS_PROJECT_HOME_PAGE"
);

export const setFrontendModeToLibrary = createAction(
  "SET_FRONTEND_MODE_LIBRARY"
);

export const setFrontendModeToStandalone = createAction(
  "SET_FRONTEND_MODE_STANDALONE",
  project => project
);

export const setFrontendModeProjectContext = createAction(
  "SET_FRONTEND_MODE_PROJECT_CONTEXT",
  project => project
);
