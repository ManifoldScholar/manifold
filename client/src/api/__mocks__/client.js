export default class ApiClient {

  call = (endpoint, method, options) => {
    return new Promise((resolve, reject) => {
      resolve({ data: {} });
    });
  }

}
