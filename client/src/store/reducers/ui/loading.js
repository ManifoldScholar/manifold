import { handleActions } from 'redux-actions';

const initialState = {
  active: false,
  activeLoaders: []
};

const getLoadingState = (activeLoaders) => {
  return activeLoaders.length > 0;
};

const maybeAddLoader = (activeLoaders, loader) => {
  if (activeLoaders.indexOf(loader) === -1) {
    activeLoaders.push(loader);
    return activeLoaders;
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


const startLoader = (state, action) => {
  const activeLoaders = maybeAddLoader(state.activeLoaders, action.payload);
  return {
    active: getLoadingState(activeLoaders),
    activeLoaders
  };
};

const stopLoader = (state, action) => {
  const activeLoaders = maybeRemoveLoader(state.activeLoaders, action.payload);
  return {
    active: getLoadingState(activeLoaders),
    activeLoaders
  };
};

export default handleActions({
  START_LOADING: startLoader,
  STOP_LOADING: stopLoader
}, initialState);
