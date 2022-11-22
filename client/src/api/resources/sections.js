export default {
  show(id) {
    return {
      endpoint: `/api/v1/text_sections/${id}`,
      method: "GET",
      options: {}
    };
  },

  update(textId, id, section) {
    return {
      endpoint: `/api/v1/texts/${textId}/relationships/text_sections/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "text_sections", data: section })
      }
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
