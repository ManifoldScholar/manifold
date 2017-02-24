export default {

  show(id) {
    return {
      endpoint: `/api/v1/collections/${id}`,
      method: 'GET',
      options: {
      }
    };
  },

  collectionResource(cid, crid) {
    return {
      endpoint: `/api/v1/collections/${cid}/relationships/collection_resources/${crid}`,
      method: 'GET',
      options: {
      }
    };
  },

  collectionResources(id, filterParams = {}, page = {}) {
    const filter = filterParams;
    filter.collection_order = id;
    return {
      endpoint: `/api/v1/collections/${id}/relationships/resources`,
      method: 'GET',
      options: {
        params: { filter, page }
      }
    };
  }

};
