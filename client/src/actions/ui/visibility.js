import { createAction } from 'redux-actions';

export const visibilityToggle = createAction('VISIBILITY_TOGGLE', subject => subject);
export const visibilityShow = createAction('VISIBILITY_SHOW', subject => subject);
export const visibilityHide = createAction('VISIBILITY_HIDE', subject => subject);
export const panelToggle = createAction('PANEL_TOGGLE', subject => subject);
export const panelShow = createAction('PANEL_SHOW', subject => subject);
export const panelHide = createAction('PANEL_HIDE', subject => subject);
export const panelHideAll = createAction('PANEL_HIDE_ALL');
