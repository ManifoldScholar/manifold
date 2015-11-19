import { camelizeKeys } from 'humps';
import config from '../config';
import qs from 'qs';

require('es6-promise').polyfill();
require('isomorphic-fetch');

export default function apiClient(endpoint, query = {}, page = {}) {
  let adjustedEndpoint;
  if (__SERVER__) {
    adjustedEndpoint = `http://${(process.env.HOST || 'localhost')}:${config.clientPort}${endpoint}`;
  } else {
    adjustedEndpoint = endpoint;
  }
  adjustedEndpoint = adjustedEndpoint + '?' + qs.stringify(query) + qs.stringify(page);
  return fetch(adjustedEndpoint)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(response);
      }
      return response.json().then(json => {
        return { json, response };
      }, () => {
        return { response };
      });
    }
    ).then(({ json }) => {
      const cleanedData = camelizeKeys(json.data);
      const entities = {};
      const results = [];
      // TODO: Break these loops out into methods so it's more clear what's happening here.
      cleanedData.forEach((entity) => {
        if (!entities.hasOwnProperty(entity.type)) {
          entities[entity.type] = {};
        }
        entities[entity.type][entity.id] = entity;
        results.push(entity.id);
      });
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


