export default {
  annotations(params) {
    return {
      endpoint: "/api/v1/bulk_delete/annotations",
      method: "DELETE",
      options: {
        body: JSON.stringify({ bulk_delete: params })
      }
    };
  },

  readingGroups(params) {
    return {
      endpoint: "/api/v1/bulk_delete/reading_groups",
      method: "DELETE",
      options: {
        body: JSON.stringify({ bulk_delete: params })
      }
    };
  },

  users(params) {
    return {
      endpoint: "/api/v1/bulk_delete/users",
      method: "DELETE",
      options: {
        body: JSON.stringify({ bulk_delete: params })
      }
    };
  }
};
