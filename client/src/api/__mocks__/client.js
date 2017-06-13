import pagination from 'test/fixtures/pagination';

export default class ApiClient {

  call = (endpoint, method, options) => {

    const collectionEndpoints = [
      "/api/v1/projects/1/relationships/resources"
    ];

    let response;
    if (collectionEndpoints.includes(endpoint)) {
      response = {
        data: [],
        meta: { pagination: pagination() }
      };
    } else {
      response = { data: {} };
    }

    return new Promise((resolve, reject) => {
      resolve(response);
    });
  }

}
