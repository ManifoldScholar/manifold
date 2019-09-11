import { handleActions } from "redux-actions";
import mapValues from "lodash/mapValues";

export const initialState = {
  loginOverlay: false,
  userMenu: false,
  visibilityFilters: {
    highlight: { yours: true, others: true },
    annotation: { yours: true, others: true },
    resource: { all: true },
    readingGroups: { all: true }
  },
  uiPanels: {
    tocDrawer: false,
    readerReturn: false,
    user: false,
    appearance: false,
    layers: false,
    search: false,
    visibility: false,
    notes: false
  }
};

const panelSolo = {
  tocDrawer: true,
  readerReturn: true,
  user: true,
  appearance: true,
  layers: true,
  search: true,
  visibility: true,
  notes: true
};

const showMyNotes = state => {
  const yours = true;
  const highlight = { ...state.visibilityFilters.highlight, yours };
  const annotation = { ...state.visibilityFilters.highlight, yours };
  const visibilityFilters = {
    ...state.visibilityFilters,
    highlight,
    annotation
  };
  return { ...state, visibilityFilters };
};

const visibilityChange = (state, action) => {
  return { ...state, ...action.payload };
};

const visibilityToggle = (state, action) => {
  return { ...state, [action.payload]: !state[action.payload] };
};

const visibilityShow = (state, action) => {
  return { ...state, [action.payload]: true };
};

const visibilityHide = (state, action) => {
  return { ...state, [action.payload]: false };
};

const panelToggle = (state, action) => {
  let soloSwitch = false;

  // If the panel should display solo and its state is false when it is toggled,
  // set other panels to false on toggle
  if (
    panelSolo[action.payload] === true &&
    state.uiPanels[action.payload] === false
  ) {
    soloSwitch = true;
  }

  const switchedPanels = mapValues(state.uiPanels, (value, key) => {
    if (key === action.payload) return !value;
    if (soloSwitch) return false;
    return value;
  });
  return { ...state, uiPanels: switchedPanels };
};

const panelShow = (state, action) => {
  const switchedPanels = mapValues(state.uiPanels, (value, key) => {
    if (key === action.payload) return true;
    if (panelSolo[action.payload] === true) return false;
    return value;
  });
  return { ...state, uiPanels: switchedPanels };
};

const panelHide = (state, action) => {
  const switchedPanels = mapValues(state.uiPanels, (value, key) => {
    if (key === action.payload) return false;
    return value;
  });
  return { ...state, uiPanels: switchedPanels };
};

const allPanelsHide = state => {
  if (!Object.values(state.uiPanels).includes(true)) return state;
  return { ...state, uiPanels: initialState.uiPanels };
};

export default handleActions(
  {
    VISIBILITY_CHANGE: visibilityChange,
    VISIBILITY_TOGGLE: visibilityToggle,
    VISIBILITY_SHOW: visibilityShow,
    VISIBILITY_HIDE: visibilityHide,
    PANEL_TOGGLE: panelToggle,
    PANEL_SHOW: panelShow,
    PANEL_HIDE: panelHide,
    PANEL_HIDE_ALL: allPanelsHide,
    SHOW_MY_NOTES: showMyNotes,
    "@@reduxReactRouter/routerDidChange": allPanelsHide
  },
  initialState
);
