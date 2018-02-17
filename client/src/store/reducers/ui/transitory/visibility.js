import { handleActions } from "redux-actions";
import mapValues from "lodash/mapValues";

export const initialState = {
  loginOverlay: false,
  userMenu: false,
  tocDrawer: false,
  visibilityFilters: {
    highlight: { yours: true, others: true },
    annotation: { yours: true, others: true },
    resource: { all: true }
  },
  uiPanels: {
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
  const highlight = Object.assign({}, state.visibilityFilters.highlight, {
    yours
  });
  const annotation = Object.assign({}, state.visibilityFilters.highlight, {
    yours
  });
  const visibilityFilters = Object.assign({}, state.visibilityFilters, {
    highlight,
    annotation
  });
  return Object.assign({}, state, { visibilityFilters });
};

const visibilityChange = (state, action) => {
  return Object.assign({}, state, action.payload);
};

const visibilityToggle = (state, action) => {
  return Object.assign({}, state, { [action.payload]: !state[action.payload] });
};

const visibilityShow = (state, action) => {
  return Object.assign({}, state, { [action.payload]: true });
};

const visibilityHide = (state, action) => {
  return Object.assign({}, state, { [action.payload]: false });
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
  return Object.assign({}, state, { uiPanels: switchedPanels });
};

const panelShow = (state, action) => {
  const switchedPanels = mapValues(state.uiPanels, (value, key) => {
    if (key === action.payload) return true;
    if (panelSolo[action.payload] === true) return false;
    return value;
  });
  return Object.assign({}, state, { uiPanels: switchedPanels });
};

const panelHide = (state, action) => {
  const switchedPanels = mapValues(state.uiPanels, (value, key) => {
    if (key === action.payload) return false;
    return value;
  });
  return Object.assign({}, state, { uiPanels: switchedPanels });
};

const allPanelsHide = state => {
  if (!Object.values(state.uiPanels).includes(true)) return state;
  return Object.assign({}, state, { uiPanels: initialState.uiPanels });
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
