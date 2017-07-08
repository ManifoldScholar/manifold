import { LowLevelApiClient } from "../client";

export default {
  createToken(email, password) {
    const lowLevelApiClient = new LowLevelApiClient();
    const results = lowLevelApiClient
      .call("/api/v1/tokens", "POST", { params: { email, password } })
      .then(response => {
        if (!response.ok) {
          return Promise.reject(response);
        }
        return response.json().then(
          json => {
            return { json, response };
          },
          () => {
            return { response };
          }
        );
      })
      .then(({ json }) => {
        return json;
      });
    return results;
  }
};
