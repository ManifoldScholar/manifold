export default {
  index(filter = {}) {
    return {
      endpoint: "/api/v1/pages",
      method: "GET",
      options: {
        params: { filter }
      }
    };
  },

  show(id) {
    return {
      endpoint: `/api/v1/pages/${id}`,
      method: "GET",
      options: {}
    };
  }
};
