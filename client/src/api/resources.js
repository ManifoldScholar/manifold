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

};
