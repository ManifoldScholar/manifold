export default {
  update(id = null, settings) {
    return {
      endpoint: `/api/v1/settings`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "settings", data: settings })
      }
    };
  },

  show() {
    return {
      endpoint: `/api/v1/settings`,
      method: "GET",
      options: {}
    };
  }
};
