export default {

  index(filter = {}, page = {}) {
    return {
      endpoint: '/api/v1/projects',
      method: 'GET',
      options: {
        params: { filter, page }
      }
    };
  },

  show(id) {
    return {
      endpoint: `/api/v1/projects/${id}`,
      method: 'GET',
      options: {
      }
    };
  },

  events(id, page = {}) {
    return {
      endpoint: `/api/v1/projects/${id}/events`,
      method: 'GET',
      options: {
        params: { page }
      }
    };
  },


  featured(limit = 6) {
    const filter = { featured: true };
    const page = { limit };
    return {
      endpoint: '/api/v1/projects',
      method: 'GET',
      options: {
        params: { filter, page }
      }
    };
  },

};
