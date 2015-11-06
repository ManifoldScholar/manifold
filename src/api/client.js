import { normalize } from 'normalizr';
import { camelizeKeys } from 'humps';
import config from '../config';

require('es6-promise').polyfill();
require('isomorphic-fetch');

function cleanAPIObject(obj) {
  const newObj = Object.assign({}, obj);
  if (newObj.hasOwnProperty('relationships')) {
    delete newObj.relationships;
  }
  return newObj;
}

export default function apiClient(endpoint, responseSchema) {
  let adjustedEndpoint;
  if (__SERVER__) {
    adjustedEndpoint = `http://${(process.env.HOST || 'localhost')}:${config.clientPort}${endpoint}`;
  } else {
    adjustedEndpoint = endpoint;
  }
  console.log(adjustedEndpoint, 'ae');
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
      let cleanedJson = camelizeKeys(json.data);
      if (cleanedJson instanceof Array) {
        cleanedJson = cleanedJson.map((obj) => {
          return cleanAPIObject(obj);
        });
      } else {
        cleanedJson = cleanAPIObject(cleanedJson);
      }

      const out = normalize(cleanedJson, responseSchema);
      return out;
    });
}


