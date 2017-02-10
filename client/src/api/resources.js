export default {

  index(filter = {}, page = {}) {
    return {
      endpoint: '/api/v1/resources',
      method: 'GET',
      options: {
        params: { filter, page }
      }
    };
  },

  show(id) {
    return {
      endpoint: `/api/v1/resources/${id}`,
      method: 'GET',
      options: {
      }
    };
  },

  create(pId, resource) {
    return {
      endpoint: `/api/v1/projects/${pId}/relationships/resources`,
      method: 'POST',
      options: {
        body: JSON.stringify({ type: "resources", data: resource })
      }
    };
  },

  update(id, resource) {
    return {
      endpoint: `/api/v1/resources/${id}`,
      method: 'PUT',
      options: {
        body: JSON.stringify({ type: "resources", data: resource })
      }
    };
  },

  destroy(id) {
    return {
      endpoint: `/api/v1/resources/${id}`,
      method: 'DELETE',
      options: {}
    };
  },


  forSection(sectionId, filter = {}) {
    return {
      endpoint: `/api/v1/text_sections/${sectionId}/relationships/resources`,
      method: 'GET',
      options: {
      }
    };
  }

};
