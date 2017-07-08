import { handleActions } from "redux-actions";

export const initialState = {
  activeAnnotation: null
};

const setActiveAnnotation = (state, action) => {
  return Object.assign({}, state, { activeAnnotation: action.payload });
};

export default handleActions(
  {
    SET_ACTIVE_ANNOTATION: setActiveAnnotation
  },
  initialState
);
