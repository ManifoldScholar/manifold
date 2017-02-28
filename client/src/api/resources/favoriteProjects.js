export default {

  index(filter = {}, page = {}) {
    return {
      endpoint: '/api/v1/me/relationships/favorite_projects',
      method: 'GET',
      options: {
        params: { filter, page }
      }
    };
  },

};
