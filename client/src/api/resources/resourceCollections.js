export default {
  show(id) {
    return {
      endpoint: `/api/v1/resource_collections/${id}`,
      method: "GET",
      options: {}
    };
  },

  create(pId, collection) {
    return {
      endpoint: `/api/v1/projects/${pId}/relationships/resource_collections`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "resource_collections", data: collection })
      }
    };
  },

  update(id, collection) {
    return {
      endpoint: `/api/v1/resource_collections/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "resource_collections", data: collection })
      }
    };
  },

  destroy(id) {
    return {
      endpoint: `/api/v1/resource_collections/${id}`,
      method: "DELETE",
      options: {}
    };
  },

  collectionResource(cid, crid) {
    return {
      endpoint: `/api/v1/resource_collections/${cid}/relationships/collection_resources/${crid}`,
      method: "GET",
      options: {}
    };
  },

  collectionResources(id, filterParams = {}, page = {}) {
    const filter = filterParams;
    filter.collection_order = id;
    return {
      endpoint: `/api/v1/resource_collections/${id}/relationships/resources`,
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  forSection(sectionId, textId, filterIgnored = {}) {
    return {
      endpoint: `/api/v1/texts/${textId}/relationships/text_sections/${sectionId}/resource_collections`,
      method: "GET",
      options: {}
    };
  }
};
