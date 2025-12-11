export default {
  create(pId, textCategory) {
    return {
      endpoint: `/api/v1/projects/${pId}/relationships/text_categories`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "text_categories", data: textCategory })
      }
    };
  },

  show(id) {
    return {
      endpoint: `/api/v1/categories/${id}`,
      method: "GET",
      options: {}
    };
  },

  destroy(id) {
    return {
      endpoint: `/api/v1/categories/${id}`,
      method: "DELETE",
      options: {}
    };
  },

  update(id, textCategory) {
    return {
      endpoint: `/api/v1/categories/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "text_categories", data: textCategory })
      }
    };
  }
};
