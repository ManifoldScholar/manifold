import { handleActions } from 'redux-actions';

const initialState = {
  fetchedRoute: null
};

const recordDataFetching = (state, action) => {
  return {
    fetchedRoute: action.payload
  };
};

export default handleActions({
  RECORD_DATA_FETCHING: recordDataFetching
}, initialState);
