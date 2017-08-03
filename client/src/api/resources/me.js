export default {
  show() {
    return {
      endpoint: "/api/v1/me",
      method: "GET",
      options: {}
    };
  },

  update(me) {
    return {
      endpoint: "/api/v1/me",
      method: "PUT",
      options: {
        body: JSON.stringify({ data: { type: "user", attributes: me } })
      }
    };
  },

  annotations(filter = {}, page = {}) {
    return {
      endpoint: `/api/v1/me/relationships/annotations`,
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  }
};
