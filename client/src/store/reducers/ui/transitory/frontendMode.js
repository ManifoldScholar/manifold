import { handleActions } from "redux-actions";
import queryString from "query-string";

const buildProjectState = project => {
  if (!project) return null;
  return {
    id: project.id,
    slug: project.attributes.slug,
    title: project.attributes.title,
    titleFormatted: project.attributes.titleFormatted,
    subtitle: project.attributes.subtitle,
    subtitleFormatted: project.attributes.subtitleFormatted,
    darkMode: project.attributes.darkMode,
    heroStyles: project.attributes.heroStyles,
    standaloneModePressBarText: project.attributes.standaloneModePressBarText,
    standaloneModePressBarUrl: project.attributes.standaloneModePressBarUrl
  };
};

const buildState = (
  mode = "library",
  state = { isProjectHomepage: false },
  payload = null
) => {
  const project = payload ? payload.project : null;
  const isLibrary = mode === "library";
  const isStandalone = mode === "standalone";
  const isProject = state.isProject || false;

  // If we're transitioning from standalone to library, we store the project ID in case
  // the user returns to it.
  const lastStandaloneId =
    isLibrary && state.isStandalone && state.project && state.project.id
      ? state.project.id
      : state.lastStandaloneId;

  return {
    isProjectHomepage: isLibrary ? false : state.isProjectHomepage || false,
    isLibrary,
    isProject,
    isStandalone,
    project: project ? buildProjectState(project) : state.project,
    lastStandaloneId
  };
};

function setModeLibrary(state) {
  return buildState("library", { ...state, isProject: false });
}

function setModeStandalone(state, action) {
  return buildState("standalone", state, action.payload);
}

function setMode(state, action) {
  const { mode, search } = action.payload;
  const query = queryString.parse(search);
  if (
    mode === "enforced" ||
    (mode === "enabled" && query.mode === "standalone")
  )
    return setModeStandalone(state, action);
  return setModeLibrary(state);
}

function setIsProjectSubpage(state) {
  return { ...state, isProjectHomepage: false };
}

function setProjectContext(state, action) {
  return buildState(state.mode, { ...state, isProject: true }, action.payload);
}

function setIsProjectHomepage(state) {
  return { ...state, isProjectHomepage: true };
}

export default handleActions(
  {
    SET_FRONTEND_MODE: setMode,
    SET_FRONTEND_MODE_LIBRARY: setModeLibrary,
    SET_FRONTEND_MODE_STANDALONE: setModeStandalone,
    SET_FRONTEND_MODE_IS_PROJECT_SUBPAGE: setIsProjectSubpage,
    SET_FRONTEND_MODE_IS_PROJECT_HOME_PAGE: setIsProjectHomepage,
    SET_FRONTEND_MODE_PROJECT_CONTEXT: setProjectContext
  },
  buildState()
);
