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

  featured(limit = 6) {
    console.log(limit, 'limit');
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
