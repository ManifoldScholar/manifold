import { createAction } from 'redux-actions';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import uuid from 'node-uuid';

export const flush = createAction('ENTITY_STORE_FLUSH', (passedMetas) => {
  let metas;
  if (isString(passedMetas)) metas = [passedMetas];
  if (!metas && isObject(passedMetas)) metas = Object.values(passedMetas);
  if (!metas && Array.isArray(passedMetas)) metas = passedMetas;
  return metas;
});

export const request = createAction('ENTITY_STORE_REQUEST', (requestConfig, meta = null) => {
  return {
    request: requestConfig,
    state: 0
  };
}, (apiConfig, meta = null) => {
  return meta || uuid.v1();
});
