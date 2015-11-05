import {handleActions} from 'redux-actions';

const initialState = {
  raised: false
};

const adjust = (state, action) => {
  let raised = null;
  if (action.type === 'RAISE_CURTAIN') {
    raised = true;
  } else {
    raised = false;
  }
  return {
    raised: raised
  };
};

export default handleActions({
  RAISE_CURTAIN: adjust,
  LOWER_CURTAIN: adjust
}, initialState);
