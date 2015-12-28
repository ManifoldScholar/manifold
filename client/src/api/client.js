import { camelizeKeys } from 'humps';
import config from '../config';
import qs from 'qs';
import { isPlainObject } from 'lodash/lang';

require('es6-promise').polyfill();
require('isomorphic-fetch');


export class LowLevelApiClient {

  constructor() {
    this.defaultOptions = {
      authToken: null,
      params: {}
    };
  }

  _adjustedOptions(options) {
    return Object.assign({}, this.defaultOptions, options);
  }

  _adjustedMethod(method) {
    return method.toLowerCase();
  }

  _adjustedEndpoint(endpoint) {
    if (!__SERVER__) {
      return endpoint;
    }
    return `http://${(process.env.HOST || 'localhost')}:${config.clientPort}${endpoint}`;
  }

  _endpointWithParams(endpoint, params) {
    return endpoint + '?' + qs.stringify(params);
  }

  call(rawEndpoint, rawMethod, rawOptions) {
    const method = this._adjustedMethod(rawMethod);
    const options = this._adjustedOptions(rawOptions);
    const endpoint = this._endpointWithParams(this._adjustedEndpoint(rawEndpoint), options.params);
    const fetchConfig = {
      method: method,
      headers: {
        'Authorization': `Bearer ${options.authToken}`
      }
    };
    return fetch(endpoint, fetchConfig).catch((error) => {
      console.log('There has been a problem with your fetch operation: ' + error.message);
    });
  }
}

export class ApiClient {

  constructor() {
    this.client = new LowLevelApiClient();
  }

  call = (endpoint, method, options) => {
    return this.client.call(endpoint, method, options)
      .then(this._responseToJson, this._fetchNotOK)
      .then(this._cleanJson, this._responseNotOK)
      .then(this._returnResults, this._jsonNotOK);
  };

  _responseToJson = (response) => {
    if (!response.ok) {
      return Promise.reject({response});
    }
    return response.json().then(
      (json) => { return {json, response}; },
      () => { return Promise.reject({response}); }
    );
  };

  _cleanJson = ({json, response}) => {
    if (!isPlainObject(json)) return Promise.reject({json, response});
    const out = {data: [], included: []};
    out.data = camelizeKeys(json.data);
    if (json.included) {
      out.included = camelizeKeys(json.included);
    }
    return Promise.resolve({json: out, response: response});
  };

  _returnResults = ({json, responseIgnored}) => {
    let out;
    if (Array.isArray(json.data)) {
      out = this._returnCollection(json);
    } else {
      out = this._returnEntity(json);
    }
    json.included.forEach((entity) => {
      if (entity) {
        if (!out.entities.hasOwnProperty(entity.type)) {
          out.entities[entity.type] = {};
        }
        out.entities[entity.type][entity.id] = entity;
      }
    });
    return out;
  };

  _returnCollection = (json) => {
    const entities = {};
    const results = [];
    json.data.forEach((entity) => {
      if (!entities.hasOwnProperty(entity.type)) {
        entities[entity.type] = {};
      }
      entities[entity.type][entity.id] = entity;
      results.push(entity.id);
    });
    return {entities, results};
  };

  _returnEntity = (json) => {
    const entities = {};
    const entity = json.data;
    const results = entity.id;
    if (!entities.hasOwnProperty(entity.type)) {
      entities[entity.type] = {};
    }
    entities[entity.type][entity.id] = entity;
    return {entities, results};
  };

  _responseNotOK = ({response}) => {
    console.log(response, 'error caught in responseNotOK');
  };

  _jsonNotOK = ({json, response}) => {
    console.log(json, response, 'error caught in jsonNotOK');
  };

  _fetchNotOK = (response) => {
    console.log(response, 'error caught in fetchNotOK');
  };

}
