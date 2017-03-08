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
//
// export const notifications = {
//   [requests.beUserUpdate]: {
//
//   }
// }
