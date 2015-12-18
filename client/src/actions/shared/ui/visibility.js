import {createAction} from 'redux-actions';

export const visibilityToggle = createAction('VISIBILITY_TOGGLE', subject => subject);
export const visibilityShow = createAction('VISIBILITY_SHOW', subject => subject);
export const visibilityHide = createAction('VISIBILITY_HIDE', subject => subject);
