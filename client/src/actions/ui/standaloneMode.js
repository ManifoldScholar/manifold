import { createAction } from "redux-actions";

export const setStandaloneMode = createAction(
  "SET_STANDALONE_MODE",
  subject => subject
);
