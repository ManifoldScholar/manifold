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
  createAction('API_REQUEST', (requestConfig, meta = null, oneTime = false) => {
    return {
      request: requestConfig,
      oneTime,
      state: 0
    };
  }, (apiConfig, meta = null) => {
    return meta || uuid.v1();
  });

export const requests = {
  browseFilteredProjects: 'browse-filtered-projects',
  browseFeaturedProjects: 'browse-featured-projects',
  showProjectDetail: 'show-project-detail',
  readerCurrentText: 'current-text',
  readerCurrentSection: 'current-section',
  developerTexts: 'developer-texts',
  developerProjects: 'developer-projects',
  updateCurrentUser: 'update-current-user',
  allPages: 'all-pages',
  showPage: 'show-page',
  sectionAnnotations: 'section-annotations',
  createAnnotation: 'create-annotation',
  showProjectEvents: 'show-project-events',
  showCollectionDetail: 'show-collection-detail',
  allUsedSubjects: 'all-used-subjects',
  followedProjects: 'followed-projects',
  projectResources: 'project-resources',
  collectionResources: 'collection-all-resources',
  slideshowResources: 'collection-slideshow-resources'
};
