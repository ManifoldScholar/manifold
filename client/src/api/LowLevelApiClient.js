import qs from "qs";
import humps from "humps";
import config from "../config";

export default class LowLevelApiClient {
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
    return config.services.api + endpoint;
  }

  _endpointWithParams(endpoint, params) {
    return endpoint + "?" + qs.stringify(humps.decamelizeKeys(params));
  }

  call(rawEndpoint, rawMethod, rawOptions) {
    const method = this._adjustedMethod(rawMethod);
    const options = this._adjustedOptions(rawOptions);
    const endpoint = this._endpointWithParams(
      this._adjustedEndpoint(rawEndpoint),
      options.params
    );
    const fetchConfig = {
      method,
      body: options.body,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${options.authToken}`
      }
    };
    const out = fetch(endpoint, fetchConfig).catch(error => {
      return new Promise((resolve, reject) => {
        reject({
          response: {
            status: 503,
            statusText: error.name,
            exception: error.message
          }
        });
      });
    });
    return out;
  }
}
