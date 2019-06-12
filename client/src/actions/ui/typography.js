import { createAction } from "redux-actions";

export const selectFont = createAction("SELECT_FONT", subject => subject);
export const incrementFontSize = createAction("INCREMENT_FONT_SIZE");
export const decrementFontSize = createAction("DECREMENT_FONT_SIZE");
export const incrementMargins = createAction("INCREMENT_MARGINS");
export const decrementMargins = createAction("DECREMENT_MARGINS");
export const resetTypography = createAction("RESET_TYPOGRAPHY");
