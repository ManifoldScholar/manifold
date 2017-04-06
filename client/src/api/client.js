import qs from 'qs';
import isPlainObject from 'lodash/isPlainObject';

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
    const out = __API_URL__ + endpoint;
    return out;
  }

  _endpointWithParams(endpoint, params) {
    return endpoint + '?' + qs.stringify(params);
  }

  call(rawEndpoint, rawMethod, rawOptions) {
    const method = this._adjustedMethod(rawMethod);
    const options = this._adjustedOptions(rawOptions);
    const endpoint = this._endpointWithParams(this._adjustedEndpoint(rawEndpoint), options.params);
    const fetchConfig = {
      method,
      body: options.body,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${options.authToken}`
      }
    };
    return fetch(endpoint, fetchConfig).catch((error) => {
      console.log('There has been a problem with your fetch operation: ' + error.message);
    });
  }
}

export default class ApiClient {

  constructor() {
    this.client = new LowLevelApiClient();
  }

  call = (endpoint, method, options) => {
    return this.client.call(endpoint, method, options)
      .then(this._responseToJson, this._fetchNotOK)
      .then(this._cleanJson, this._responseNotOK)
      .then(this._returnResults, this._jsonNotOK)
      .catch(this._handleFailure);
  };

  _responseToJson = (response) => {
    if (!response) {
      const returnResponse = new Response(
        JSON.stringify({
          errors: [
            {
              id: 'API_ERROR',
              status: 503,
              title: "API Service Unavailable.",
              detail: "Manifold is experiencing problems communicating with its API " +
              "backend. Please report this problem to the Manifold administrative team."
            }
          ]
        }),
        { status: 503, statusText: "serviceUnavailable" }
      );
      return Promise.reject({ returnResponse });
    }
    if (!response.ok) {
      return Promise.reject({ response });
    }
    if (response.status === 204) {
      return { json: null, response };
    }
    return response.json().then(
      (json) => { return { json, response }; },
      () => { console.log('API response error #4'); return Promise.reject({ response }); }
    );
  };

  _cleanJson = ({ json, response }) => {
    if (json === null) return Promise.resolve({ json, response });
    if (!isPlainObject(json)) return Promise.reject({ json, response });
    const out = { data: [], included: [] };
    out.data = json.data;
    if (json.included) {
      out.included = json.included;
    }
    if (json.links) {
      out.links = json.links;
    }
    if (json.meta) {
      out.meta = json.meta;
    }
    return Promise.resolve({ json: out, response });
  };

  _returnResults = ({ json, responseIgnored }) => {
    return json;
  };

  _responseNotOK = (response) => {
    return Promise.reject(response);
  };

  _jsonNotOK = (response) => {
    return Promise.reject(response);
  };

  _fetchNotOK = (response) => {
    return Promise.reject(response);
  };

  _handleFailure = (reason) => {
    return new Promise((resolve, reject) => {
      const response = reason.returnResponse || reason.response;
      const payload = {
        status: response.status,
        statusText: response.statusText,
        body: null
      };
      response.json().then(
        (json) => {
          reject(Object.assign(payload, { body: json }));
        },
        () => {
          reject(payload);
        }
      );
    });
  };

}
