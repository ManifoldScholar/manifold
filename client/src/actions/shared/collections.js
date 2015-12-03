
import {textsAPI, projectsAPI} from '../../api';
import createApiAction from '../helpers/createApiAction';

export const actions = {
  FETCH_TEXTS: 'FETCH_TEXTS',
  FETCH_ONE_TEXT: 'FETCH_ONE_TEXT',
  FETCH_ONE_PROJECT: 'FETCH_ONE_PROJECT',
  FETCH_FEATURED_PROJECTS: 'FETCH_FEATURED_PROJECTS',
  FETCH_FILTERED_PROJECTS: 'FETCH_FILTERED_PROJECTS',
};

export const fetchFeaturedProjects = createApiAction(actions.FETCH_FEATURED_PROJECTS, projectsAPI.featuredProjects);
export const fetchFilteredProjects = createApiAction(actions.FETCH_FILTERED_PROJECTS, projectsAPI.filteredProjects);
