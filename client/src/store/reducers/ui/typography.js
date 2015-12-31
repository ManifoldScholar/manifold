import {handleActions} from 'redux-actions';

const initialState = {
  font: 'serif',
  size: 3,
  sizeMax: 5,
  sizeMin: 0
};

const selectFont = (state, action) => {
  return Object.assign({}, state, {font: action.payload});
};

const incrementFontSize = (state) => {
  let value = state.size;
  if (value < state.sizeMax) {
    value = value + 1;
  }
  return Object.assign({}, state, {size: value});
};

const decrementFontSize = (state) => {
  let value = state.size;
  if (value > state.sizeMin) {
    value = value - 1;
  }
  return Object.assign({}, state, {size: value});
};

export default handleActions({
  SELECT_FONT: selectFont,
  INCREMENT_FONT_SIZE: incrementFontSize,
  DECREMENT_FONT_SIZE: decrementFontSize
}, initialState);
