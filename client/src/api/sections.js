export default {

  section(id) {
    return {
      endpoint: `/api/v1/text_sections/${id}`,
      method: 'GET',
      options: {
      }
    };
  },

};

