export default {
  index(projectCollectionId) {
    return {
      endpoint: `/api/v1/project_collections/${projectCollectionId}/relationships/collection_projects`,
      method: "GET"
    };
  },

  create(projectCollectionId, collectionProject) {
    return {
      endpoint: `/api/v1/project_collections/${projectCollectionId}/relationships/collection_projects`,
      method: "POST",
      options: {
        body: JSON.stringify({
          type: "collectionProjects",
          data: collectionProject
        })
      }
    };
  },

  destroy(projectCollectionId, collectionProjectId) {
    return {
      endpoint: `/api/v1/project_collections/${projectCollectionId}/relationships/collection_projects/${collectionProjectId}`,
      method: "DELETE",
      options: {}
    };
  }
};
