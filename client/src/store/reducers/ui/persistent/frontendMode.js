import { handleActions } from "redux-actions";
import queryString from "query-string";

const buildState = (
  mode = "library",
  state = { isProjectHomepage: true },
  payload = null
) => {
  const isLibrary = mode === "library";
  if (isLibrary && state.isLibrary) return state;
  const isStandalone = mode === "standalone";
  if (isStandalone && state.isStandalone && payload.project === state.project)
    return state;
  if (isStandalone)
    return {
      isProjectHomepage: state.isProjectHomepage,
      isLibrary,
      isStandalone,
      project: {
        id: payload.project.id,
        slug: payload.project.attributes.slug,
        title: payload.project.attributes.title,
        titleFormatted: payload.project.attributes.titleFormatted,
        subtitle: payload.project.attributes.subtitle,
        subtitleFormatted: payload.project.attributes.subtitleFormatted,
        darkMode: payload.project.attributes.darkMode,
        heroStyles: payload.project.attributes.heroStyles,
        standaloneModePressBarText:
          payload.project.attributes.standaloneModePressBarText,
        standaloneModePressBarUrl:
          payload.project.attributes.standaloneModePressBarUrl
      }
    };
  return {
    isLibrary,
    isStandalone,
    project: null
  };
};

function setModeLibrary(state) {
  return buildState("library", state);
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

function setIsProjectHomepage(state) {
  return { ...state, isProjectHomepage: true };
}

export default handleActions(
  {
    SET_FRONTEND_MODE: setMode,
    SET_FRONTEND_MODE_LIBRARY: setModeLibrary,
    SET_FRONTEND_MODE_STANDALONE: setModeStandalone,
    SET_FRONTEND_MODE_IS_PROJECT_SUBPAGE: setIsProjectSubpage,
    SET_FRONTEND_MODE_IS_PROJECT_HOME_PAGE: setIsProjectHomepage
  },
  buildState()
);
