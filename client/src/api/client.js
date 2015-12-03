import { camelizeKeys } from 'humps';
import config from '../config';
import qs from 'qs';

require('es6-promise').polyfill();
require('isomorphic-fetch');

const defaultOptions = {
  authToken: null,
  params: {}
};

export function lowLevelApiClient(endpoint, method, options) {
  const adjustedOptions = Object.assign({}, defaultOptions, options);
  let adjustedEndpoint;
  if (__SERVER__) {
    adjustedEndpoint = `http://${(process.env.HOST || 'localhost')}:${config.clientPort}${endpoint}`;
  } else {
    adjustedEndpoint = endpoint;
  }
  adjustedEndpoint = adjustedEndpoint + '?' + qs.stringify(adjustedOptions.params);
  const fetchOptions = {
    method: method.toLowerCase(),
    headers: {
      'Authorization': `Bearer ${options.authToken}`
    }
  };

  return fetch(adjustedEndpoint, fetchOptions);
}

export function apiClient(endpoint, method, options) {
  const adjustedOptions = Object.assign({}, defaultOptions, options);
  const fetchPromise = lowLevelApiClient(endpoint, method, adjustedOptions);
  return fetchPromise.then(response => {
    if (!response.ok) {
      return Promise.reject(response);
    }
    return response.json().then(json => {
      return {json, response};
    }, () => {
      return {response};
    });
  }).then(({ json }) => {

    const cleanedData = camelizeKeys(json.data);
    const entities = {};
    let results = [];
    // TODO: Break these loops out into methods so it's more clear what's happening here.
    if (Array.isArray(cleanedData)) {
      cleanedData.forEach((entity) => {
        if (!entities.hasOwnProperty(entity.type)) {
          entities[entity.type] = {};
        }
        entities[entity.type][entity.id] = entity;
        results.push(entity.id);
      });
    } else {
      const entity = cleanedData;
      if (!entities.hasOwnProperty(entity.type)) {
        entities[entity.type] = {};
      }
      entities[entity.type][entity.id] = entity;
      results = entity.id;
    }
    if (json.included) {
      const cleanedIncluded = camelizeKeys(json.included);
      cleanedIncluded.forEach((entity) => {
        if (entity) {
          if (!entities.hasOwnProperty(entity.type)) {
            entities[entity.type] = {};
          }
          entities[entity.type][entity.id] = entity;
        }
      });
    }

    const out = {entities: entities, results: results};
    return out;
  });
}


