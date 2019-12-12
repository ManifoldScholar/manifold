import fixtures from "test/fixtures";
import some from "lodash/some";

export default class ApiClient {
  call = (endpoint, methodIgnored, optionsIgnored) => {
    const collectionEndpoints = [
      /\/api\/v1\/projects\/\w*\/relationships\/resources/,
      /\/api\/v1\/projects\/\w*\/relationships\/twitter_queries/,
      /\/api\/v1\/annotations\/\w*\/relationships\/comments/,
      /\/api\/v1\/resources\/\w*\/relationships\/comments/,
      /\/api\/v1\/me\/relationships\/reading_groups/
    ];

    let response;

    const isCollectionEndpoint = some(collectionEndpoints, pattern => {
      return pattern.test(endpoint);
    });

    if (isCollectionEndpoint) {
      response = {
        data: [],
        meta: { pagination: fixtures.pagination() }
      };
    } else {
      response = { data: {} };
    }

    return new Promise((resolve, rejectIgnored) => {
      resolve(response);
    });
  };
}
