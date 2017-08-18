export default {
  show(id) {
    return {
      endpoint: `/api/v1/collections/${id}`,
      method: "GET",
      options: {}
    };
  },

  create(pId, collection) {
    return {
      endpoint: `/api/v1/projects/${pId}/relationships/collections`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "collections", data: collection })
      }
    };
  },

  update(id, collection) {
    return {
      endpoint: `/api/v1/collections/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "collections", data: collection })
      }
    };
  },

  destroy(id) {
    return {
      endpoint: `/api/v1/collections/${id}`,
      method: "DELETE",
      options: {}
    };
  },

  collectionResource(cid, crid) {
    return {
      endpoint: `/api/v1/collections/${cid}/relationships/collection_resources/${crid}`,
      method: "GET",
      options: {}
    };
  },

  collectionResources(id, filterParams = {}, page = {}) {
    const filter = filterParams;
    filter.collection_order = id;
    return {
      endpoint: `/api/v1/collections/${id}/relationships/resources`,
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  forSection(sectionId, filterIgnored = {}) {
    return {
      endpoint: `/api/v1/text_sections/${sectionId}/relationships/collections`,
      method: "GET",
      options: {}
    };
  }
};
