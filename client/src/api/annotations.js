export default {

  forSection(sectionId) {
    return {
      endpoint: `/api/v1/text_sections/${sectionId}/relationships/annotations`,
      method: 'GET',
      options: {
      }
    };
  },

  create(sectionId, annotation) {
    return {
      endpoint: `/api/v1/text_sections/${sectionId}/relationships/annotations`,
      method: 'POST',
      options: {
        body: JSON.stringify({ type: "annotation", data: { attributes: annotation } })
      }
    };
  }

};
