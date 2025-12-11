export default {
  /* eslint-disable no-unused-vars */
  update(id = null, settings) {
    return {
      endpoint: `/api/v1/settings`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "settings", data: settings })
      }
    };
  },
  /* eslint-enable no-unused-vars */

  show(options = {}) {
    return {
      endpoint: `/api/v1/settings`,
      method: "GET",
      options
    };
  }
};
