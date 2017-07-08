import { createAction } from "redux-actions";

export const setActiveAnnotation = createAction(
  "SET_ACTIVE_ANNOTATION",
  aId => aId
);
