import { handleActions } from "redux-actions";

const getInitialState = () => ({
  currentAnnotatingReadingGroup: "private",
  currentAnnotationOverlayReadingGroup: "me"
});

const setAnnotatingReadingGroup = (state, action) => {
  return { ...state, currentAnnotatingReadingGroup: action.payload };
};

const setAnnotationOverlayReadingGroup = (state, action) => {
  return { ...state, currentAnnotationOverlayReadingGroup: action.payload };
};

const resetReadingGroup = () => {
  return getInitialState();
};

const setPersistentUI = (state, action) => {
  return { ...getInitialState(), ...action.payload.readingGroups };
};

export default handleActions(
  {
    SET_PERSISTENT_UI: setPersistentUI,
    SET_ANNOTATING_READING_GROUP: setAnnotatingReadingGroup,
    SET_ANNOTATION_OVERLAY_READING_GROUP: setAnnotationOverlayReadingGroup,
    LOGOUT: resetReadingGroup
  },
  getInitialState()
);
