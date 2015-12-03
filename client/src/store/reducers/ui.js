import {handleActions} from 'redux-actions';

const initialState = {
  projectFilters: {}
};

const setProjectFilters = (state, action) => {
  return Object.assign({}, state, {projectFilters: action.payload});
};

export default handleActions({
  SET_PROJECT_FILTERS: setProjectFilters
}, initialState);
