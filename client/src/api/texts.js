export default {

  index(filter, page) {
    return {
      endpoint: '/api/v1/texts',
      method: 'GET',
      options: {
        params: { filter, page }
      }
    };
  },

  show(id) {
    return {
      endpoint: `/api/v1/texts/${id}`,
      method: 'GET',
      options: {
      }
    };
  },

};
