import { handleActions } from 'redux-actions';

const initialState = {
  colorScheme: 'light'
};

const setColorScheme = (state, action) => {
  return Object.assign({}, state, { colorScheme: action.payload });
};

export default handleActions({
  SET_COLOR_SCHEME: setColorScheme
}, initialState);
