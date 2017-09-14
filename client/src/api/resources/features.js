export default {
  index(filter = {}) {
    return {
      endpoint: "/api/v1/features",
      method: "GET",
      options: {
        params: { filter }
      }
    };
  },

  show(id) {
    return {
      endpoint: `/api/v1/features/${id}`,
      method: "GET",
      options: {}
    };
  },

  create(feature) {
    return {
      endpoint: `/api/v1/features`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "features", data: feature })
      }
    };
  },

  update(id, feature) {
    return {
      endpoint: `/api/v1/features/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "features", data: feature })
      }
    };
  },

  destroy(id) {
    return {
      endpoint: `/api/v1/features/${id}`,
      method: "DELETE",
      options: {}
    };
  }
};
