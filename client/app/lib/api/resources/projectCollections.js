export default {
  index(filter = {}, page = {}) {
    return {
      endpoint: "/api/v1/project_collections",
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  show(id, page = {}) {
    return {
      endpoint: `/api/v1/project_collections/${id}`,
      method: "GET",
      options: {
        params: { page }
      }
    };
  },

  create(projectCollection) {
    return {
      endpoint: `/api/v1/project_collections`,
      method: "POST",
      options: {
        body: JSON.stringify({
          type: "project_collections",
          data: projectCollection
        })
      }
    };
  },

  update(id, projectCollection, page = {}) {
    return {
      endpoint: `/api/v1/project_collections/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({
          type: "project_collections",
          data: projectCollection
        }),
        params: { page }
      }
    };
  },

  destroy(id) {
    return {
      endpoint: `/api/v1/project_collections/${id}`,
      method: "DELETE",
      options: {}
    };
  },

  collectionProjects(id, filterParams = {}, page = {}) {
    const filter = filterParams;
    filter.collection_order = id;
    return {
      endpoint: `/api/v1/project_collections/${id}/relationships/collection_projects`,
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  updateCollectionProject(pId, id, collectionProject) {
    return {
      endpoint: `/api/v1/project_collections/${pId}/relationships/collection_projects/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({
          type: "project_collections",
          data: collectionProject
        })
      }
    };
  }
};
