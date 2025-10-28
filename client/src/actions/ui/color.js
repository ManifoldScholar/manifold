import { createAction } from "redux-actions";

export const setColorScheme = createAction(
  "SET_COLOR_SCHEME",
  subject => subject
);

export const setHighContrast = createAction(
  "SET_HIGH_CONTRAST",
  subject => subject
);
