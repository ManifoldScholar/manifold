import {createAction} from 'redux-actions';
import {textsAPI, projectsAPI} from '../../api';

export const actions = {
  FETCH_TEXTS: 'FETCH_TEXTS',
  FETCH_ONE_TEXT: 'FETCH_ONE_TEXT',
  FETCH_ONE_PROJECT: 'FETCH_ONE_PROJECT',
  FETCH_FEATURED_PROJECTS: 'FETCH_FEATURED_PROJECTS',
  FETCH_FILTERED_PROJECTS: 'FETCH_FILTERED_PROJECTS'
};

export const fetchTexts = createAction(actions.FETCH_TEXTS, textsAPI.texts);
export const fetchOneText = createAction(actions.FETCH_ONE_TEXT, textsAPI.text);
export const fetchOneProject = createAction(actions.FETCH_ONE_PROJECT, projectsAPI.projects);
export const fetchFeaturedProjects = createAction(actions.FETCH_FEATURED_PROJECTS, projectsAPI.featuredProjects);
export const fetchFilteredProjects = createAction(actions.FETCH_FILTERED_PROJECTS, projectsAPI.filteredProjects);
