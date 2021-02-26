/* eslint-disable no-console */
import isPlainObject from "lodash/isPlainObject";
import has from "lodash/has";
import LowLevelApiClient from "./LowLevelApiClient";

require("isomorphic-fetch");

export default class ApiClient {
  constructor() {
    this.client = new LowLevelApiClient();
  }

  call = (endpoint, method, options) => {
    return this.client
      .call(endpoint, method, options)
      .then(this._responseToJson, this._fetchNotOK)
      .then(this._cleanJson, this._responseNotOK)
      .then(this._returnResults, this._jsonNotOK)
      .catch(this._handleFailure);
  };

  _responseToJson = response => {
    if (!response) {
      const returnResponse = new Response(
        JSON.stringify({
          errors: [
            {
              id: "API_ERROR",
              status: 503,
              title: "API Service Unavailable.",
              detail:
                "Manifold is experiencing problems communicating with its API " +
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
      json => {
        return { json, response };
      },
      () => {
        console.log("API response error #4");
        return Promise.reject({ response });
      }
    );
  };

  _cleanJson = ({ json, response }) => {
    if (json === null) return Promise.resolve({ json, response });
    if (!isPlainObject(json)) return Promise.reject({ json, response });
    const out = { data: [], included: [] };
    out.data = has(json, "data") ? json.data : {};

    if (json.included) {
      out.included = json.included;
    }
    if (json["atomic:results"]) {
      out.atomicResults = json["atomic:results"];
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

  _responseNotOK = response => {
    return Promise.reject(response);
  };

  _jsonNotOK = response => {
    return Promise.reject(response);
  };

  _fetchNotOK = response => {
    return Promise.reject(response);
  };

  _handleFailure = reason => {
    return new Promise((resolve, reject) => {
      const response = reason.returnResponse || reason.response;
      const payload = {
        status: response.status,
        statusText: response.statusText,
        body: {
          exception: response.exception,
          status: response.status,
          error: response.statusText
        }
      };
      if (!response.json) reject(payload);
      response.json().then(
        json => {
          reject(Object.assign(payload, { body: json }));
        },
        () => {
          reject(payload);
        }
      );
    });
  };
}
