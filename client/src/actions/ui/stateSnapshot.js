import { createAction } from "redux-actions";

export const setDashboardProjectsListSnapshot = createAction(
  "SET_DASHBOARD_PROJECTS_LIST_SNAPSHOT",
  dashboardProjectsListSnapshot => dashboardProjectsListSnapshot
);

export const resetDashboardProjectsListSnapshot = createAction(
  "RESET_DASHBOARD_PROJECTS_LIST_SNAPSHOT"
);

export const setProjectsListSnapshot = createAction(
  "SET_PROJECTS_LIST_SNAPSHOT",
  projectsListSnapshot => projectsListSnapshot
);

export const resetProjectsListSnapshot = createAction(
  "RESET_PROJECTS_LIST_SNAPSHOT"
);
