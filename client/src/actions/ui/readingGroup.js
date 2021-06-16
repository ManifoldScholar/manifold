import { createAction } from "redux-actions";

export const setAnnotatingReadingGroup = createAction(
  "SET_ANNOTATING_READING_GROUP",
  id => id
);

export const setAnnotationOverlayReadingGroup = createAction(
  "SET_ANNOTATION_OVERLAY_READING_GROUP",
  id => id
);
