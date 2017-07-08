export default {
  index(filter = {}, page = {}) {
    return {
      endpoint: "/api/v1/makers",
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  create(maker) {
    return {
      endpoint: "/api/v1/makers",
      method: "POST",
      options: {
        body: JSON.stringify({ type: "makers", data: maker })
      }
    };
  },

  update(id, maker) {
    return {
      endpoint: `/api/v1/makers/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "maker", data: maker })
      }
    };
  },

  show(id) {
    return {
      endpoint: `/api/v1/makers/${id}`,
      method: "GET",
      options: {}
    };
  },

  destroy(id) {
    return {
      endpoint: `/api/v1/makers/${id}`,
      method: "DELETE",
      options: {}
    };
  }
};
