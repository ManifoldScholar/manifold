export default {
  show(id, textId) {
    return {
      endpoint: `/api/v1/texts/${textId}/relationships/text_sections/${id}`,
      method: "GET",
      options: {}
    };
  },

  create(textId, section) {
    return {
      endpoint: `/api/v1/texts/${textId}/relationships/text_sections`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "text_sections", data: section })
      }
    };
  },

  update(id, section) {
    return {
      endpoint: `/api/v1/text_sections/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "text_sections", data: section })
      }
    };
  },

  destroy(id) {
    return {
      endpoint: `/api/v1/text_sections/${id}`,
      method: "DELETE",
      options: {}
    };
  },

  forText(textId) {
    return {
      endpoint: `/api/v1/texts/${textId}/relationships/text_sections`,
      method: "GET",
      options: {}
    };
  }
};
