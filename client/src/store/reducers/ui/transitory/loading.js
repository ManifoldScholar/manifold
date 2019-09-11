import { handleActions } from "redux-actions";

const initialState = {
  active: false,
  activeLoaders: [],
  pendingRemovals: []
};

const getLoadingState = activeLoaders => {
  return activeLoaders.length > 0;
};

const maybeAddLoader = (activeLoaders, loader) => {
  if (activeLoaders.indexOf(loader) === -1) {
    const newActiveLoaders = activeLoaders.slice(0);
    newActiveLoaders.push(loader);
    return newActiveLoaders;
  }
  return activeLoaders;
};

const maybeRemoveLoader = (activeLoaders, loader) => {
  const loaderIndex = activeLoaders.indexOf(loader);
  if (loaderIndex >= 0) {
    activeLoaders.splice(loaderIndex, 1);
    return activeLoaders;
  }
  return activeLoaders;
};

const isLoaderActive = (activeLoaders, loader) => {
  const loaderIndex = activeLoaders.indexOf(loader);
  if (loaderIndex >= 0) return true;
  return false;
};

const startLoader = (state, action) => {
  if (
    state.pendingRemovals &&
    state.pendingRemovals.indexOf(action.payload) >= 0
  ) {
    const pendingRemovals = state.pendingRemovals.slice(0);
    pendingRemovals.splice(pendingRemovals.indexOf(action.payload), 1);
    return { ...state, pendingRemovals };
  }
  const activeLoaders = maybeAddLoader(state.activeLoaders, action.payload);
  return { ...state, active: getLoadingState(activeLoaders), activeLoaders };
};

const stopLoader = (state, action) => {
  if (!isLoaderActive(state.activeLoaders, action.payload)) {
    const pendingRemovals = state.pendingRemovals.slice(0);
    if (pendingRemovals.indexOf(action.payload) === -1) {
      pendingRemovals.push(action.payload);
      return { ...state, pendingRemovals };
    }
    return state;
  }
  const activeLoaders = maybeRemoveLoader(state.activeLoaders, action.payload);
  return { ...state, active: getLoadingState(activeLoaders), activeLoaders };
};

export default handleActions(
  {
    START_LOADING: startLoader,
    STOP_LOADING: stopLoader
  },
  initialState
);
