import LowLevelApiClient from "api/LowLevelApiClient";

export default {
  createToken({ email, password, authCode }) {
    const lowLevelApiClient = new LowLevelApiClient();
    const results = lowLevelApiClient
      .call("/api/v1/tokens", "POST", {
        body: JSON.stringify({ email, password, authCode })
      })
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
  },

  loginForm({ email, password }) {
    return {
      endpoint: "/api/v1/tokens",
      method: "POST",
      options: { body: JSON.stringify({ email, password }) }
    };
  }
};
