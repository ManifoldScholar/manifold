import { handleActions } from "redux-actions";

export const initialState = {
  activeAnnotation: null,
  activeAnnotationPassive: false
};

const setActiveAnnotation = (state, action) => {
  const { payload } = action;
  let newState;
  if (!payload) {
    newState = { activeAnnotation: null, activeAnnotationPassive: false };
  } else {
    newState = {
      activeAnnotation: payload.annotationId,
      activeAnnotationPassive: payload.passive
    };
  }
  return Object.assign({}, state, newState);
};

export default handleActions(
  {
    SET_ACTIVE_ANNOTATION: setActiveAnnotation
  },
  initialState
);
