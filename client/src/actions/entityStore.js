import { createAction } from 'redux-actions';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import uuid from 'uuid';

export const flush = createAction('ENTITY_STORE_FLUSH', (passedMetas) => {
  let metas;
  if (isString(passedMetas)) metas = [passedMetas];
  if (!metas && isObject(passedMetas)) metas = Object.values(passedMetas);
  if (!metas && Array.isArray(passedMetas)) metas = passedMetas;
  return metas;
});

export const request =
  createAction('API_REQUEST', (requestConfig, meta = null, options = {}) => {
    return Object.assign({}, options, {
      request: requestConfig,
      state: 0
    });
  }, (apiConfig, meta = null) => {
    return meta || uuid.v1();
  });

export const requests = {
  beProjects: 'backend-projects',
  beStats: 'backend-stats',
  beResource: 'backend-resource',
  beResources: 'backend-resources',
  beResourceDestroy: 'backend-resource-destroy',
  beText: 'backend-text',
  beMaker: 'backend-maker',
  beMakers: 'backend-makers',
  beMakerCreate: 'backend-maker-create',
  beMakerUpdate: 'backend-maker-update',
  beMakerDestroy: 'backend-maker-destroy',
  beUser: 'backend-user',
  beUsers: 'backend-users',
  beUserUpdate: 'backend-user-update',
  beUserDestroy: 'backend-user-destroy',
  beTextUpdate: 'backend-text-update',
  beTextDestroy: 'backend-text-destroy',
  beTextCategoryUpdate: 'backend-text-category-update',
  beTextCategoryDestroy: 'backend-text-category-destroy',
  beTextCategory: 'backend-text-category',
  beProjectUpdate: 'backend-project-update',
  beProjectDestroy: 'backend-project-destroy',
  feProject: 'frontend-project',
  tmpProject: 'project-detail',
  feProjectsFiltered: 'frontend-projects-filtered',
  feProjectsFeatured: 'frontend-projects-featured',
  feProjectsFollowed: 'frontend-projects-followed',
  feEvents: 'frontend-events',
  feSubjects: 'frontend-subjects',
  feResources: 'frontend-resources',
  feResource: 'frontend-resource',
  feSlideshow: 'frontend-slideshow',
  feCollection: 'frontend-collection',
  feCollectionResources: 'frontend-collection-resources',
  rText: 'reader-text',
  rSection: 'reader-section',
  rAnnotations: 'reader-annotations',
  rResources: 'reader-resources',
  rResource: 'reader-resource',
  rAnnotationCreate: 'reader-annotation-create',
  gAuthenticatedUserUpdate: 'global-authenticated-user-update',
  gPages: 'global-pages',
  gPage: 'global-page',
  gPasswordRequest: 'global-password-request',
  gPasswordReset: 'global-password-reset',
  settings: 'settings'
};
