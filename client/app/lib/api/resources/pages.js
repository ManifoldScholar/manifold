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
  },

  create(page) {
    return {
      endpoint: `/api/v1/pages`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "pages", data: page })
      }
    };
  },

  update(id, page) {
    return {
      endpoint: `/api/v1/pages/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "pages", data: page })
      }
    };
  },

  destroy(id) {
    return {
      endpoint: `/api/v1/pages/${id}`,
      method: "DELETE",
      options: {}
    };
  }
};
