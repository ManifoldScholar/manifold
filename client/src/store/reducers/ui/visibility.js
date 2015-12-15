import {handleActions} from 'redux-actions';

const initialState = {
  loginOverlay: false,
  tocDrawer: false
};

const visibilityToggle = (state, action) => {
  return Object.assign({}, state, {[action.payload]: !state[action.payload]});
};

const visibilityShow = (state, action) => {
  return Object.assign({}, state, {[action.payload]: true});
};

const visibilityHide = (state, action) => {
  return Object.assign({}, state, {[action.payload]: false});
};

export default handleActions({
  VISIBILITY_TOGGLE: visibilityToggle,
  VISIBILITY_SHOW: visibilityShow,
  VISIBILITY_HIDE: visibilityHide
}, initialState);
