import {handleActions} from 'redux-actions';

const initialState = {
  colorScheme: 'light'
};

const selectColorScheme = (state, action) => {
  return Object.assign({}, state, {colorScheme: action.payload});
};

export default handleActions({
  SELECT_COLOR_SCHEME: selectColorScheme
}, initialState);
