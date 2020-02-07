export default {
  index() {
    return {
      endpoint: "/api/v1/export_targets",
      method: "GET",
      options: {}
    };
  },

  update(id, exportTarget) {
    return {
      endpoint: `/api/v1/export_targets/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "exportTarget", data: exportTarget })
      }
    };
  },

  show(id) {
    return {
      endpoint: `/api/v1/export_targets/${id}`,
      method: "GET",
      options: {}
    };
  },

  create(exportTarget) {
    return {
      endpoint: "/api/v1/export_targets",
      method: "POST",
      options: {
        body: JSON.stringify({ type: "exportTarget", data: exportTarget })
      }
    };
  },

  destroy(id) {
    return {
      endpoint: `/api/v1/export_targets/${id}`,
      method: "DELETE",
      options: {}
    };
  }
};
