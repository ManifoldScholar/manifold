export default {
  show(id) {
    return {
      endpoint: `/api/v1/content_blocks/${id}`,
      method: "GET",
      options: {}
    };
  },

  create(pId, contentBlock) {
    return {
      endpoint: `/api/v1/projects/${pId}/relationships/content_blocks`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "content_blocks", data: contentBlock })
      }
    };
  },

  update(id, contentBlock) {
    return {
      endpoint: `/api/v1/content_blocks/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "content_blocks", data: contentBlock })
      }
    };
  },

  destroy(id) {
    return {
      endpoint: `/api/v1/content_blocks/${id}`,
      method: "DELETE",
      options: {}
    };
  }
};
