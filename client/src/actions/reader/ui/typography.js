import {createAction} from 'redux-actions';

export const selectFont = createAction('SELECT_FONT', subject => subject);
export const incrementFontSize = createAction('INCREMENT_FONT_SIZE');
export const decrementFontSize = createAction('DECREMENT_FONT_SIZE');
