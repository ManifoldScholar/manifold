export default {

  index(filter = {}) {
    return {
      endpoint: '/api/v1/subjects',
      method: 'GET',
      options: {
        params: { filter }
      }
    };
  },

  show(id) {
    return {
      endpoint: `/api/v1/subjects/${id}`,
      method: 'GET',
      options: {
      }
    };
  }

};
