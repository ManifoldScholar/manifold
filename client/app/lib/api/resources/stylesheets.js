export default {
  create(textId, stylesheet) {
    return {
      endpoint: `/api/v1/texts/${textId}/relationships/stylesheets`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "stylesheets", data: stylesheet })
      }
    };
  },

  update(id, stylesheet) {
    return {
      endpoint: `/api/v1/stylesheets/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "stylesheets", data: stylesheet })
      }
    };
  },

  show(id) {
    return {
      endpoint: `/api/v1/stylesheets/${id}`,
      method: "GET",
      options: {}
    };
  },

  destroy(id) {
    return {
      endpoint: `/api/v1/stylesheets/${id}`,
      method: "DELETE",
      options: {}
    };
  }
};
