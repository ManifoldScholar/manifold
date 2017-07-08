import { createAction } from "redux-actions";

export const setColorScheme = createAction(
  "SET_COLOR_SCHEME",
  subject => subject
);
