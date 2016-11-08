export default {

  show(id) {
    return {
      endpoint: `/api/v1/collections/${id}`,
      method: 'GET',
      options: {
      }
    };
  },

};
