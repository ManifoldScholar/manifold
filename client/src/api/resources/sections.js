export default {
  show(id) {
    return {
      endpoint: `/api/v1/text_sections/${id}`,
      method: "GET",
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
