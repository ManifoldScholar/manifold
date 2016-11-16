export default {

  show(id) {
    return {
      endpoint: `/api/v1/collections/${id}`,
      method: 'GET',
      options: {
      }
    };
  },

  collectionResources(id, filter = {}, page = {}) {
    return {
      endpoint: `/api/v1/collections/${id}/relationships/collection_resources`,
      method: 'GET',
      options: {
        params: { filter, page }
      }
    };
  }

};
