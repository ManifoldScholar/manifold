export default {

  show(id) {
    return {
      endpoint: `/api/v1/collections/${id}`,
      method: 'GET',
      options: {
      }
    };
  },

  resources(id, filter = {}, page = {}) {
    return {
      endpoint: `/api/v1/collections/${id}/relationships/resources`,
      method: 'GET',
      options: {
        params: { filter, page }
      }
    };
  },

};
