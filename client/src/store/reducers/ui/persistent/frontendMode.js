import { handleActions } from "redux-actions";
import queryString from "query-string";

const buildState = (mode = "library", state = {}, payload = null) => {
  const isLibrary = mode === "library";
  if (isLibrary && state.isLibrary) return state;
  const isStandalone = mode === "standalone";
  if (isStandalone && state.isStandalone && payload.project === state.project) return state;
  if (isStandalone) return {
    isLibrary, isStandalone, project: {
      slug: payload.project.attributes.slug,
      title: payload.project.attributes.title,
      titleFormatted: payload.project.attributes.titleFormatted,
      subtitle: payload.project.attributes.subtitle,
      subtitleFormatted: payload.project.attributes.subtitleFormatted,
      darkMode: payload.project.attributes.darkMode,
      heroStyles: payload.project.attributes.heroStyles,
      id: payload.project.id
    }
  };
  return {
    isLibrary, isStandalone, project: null
  };
};

function setMode(state, action) {
  const { mode, search } = action.payload;
  const query = queryString.parse(search);
  if (
    mode === "enforced" ||
    (mode === "enabled" && query.mode === "standalone")
  ) return setModeStandalone(state, action);
  return setModeLibrary(state);
};

function setModeLibrary(state) {
  return buildState("library", state);
};

function setModeStandalone(state, action) {
  return buildState("standalone", state, action.payload);
};

export default handleActions(
  {
    SET_FRONTEND_MODE: setMode,
    SET_FRONTEND_MODE_LIBRARY: setModeLibrary,
    SET_FRONTEND_MODE_STANDALONE: setModeStandalone
  },
  buildState()
);
