export default {
  create(pId, resourceImport) {
    return {
      endpoint: `/api/v1/projects/${pId}/relationships/resource_imports`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "resource_imports", data: resourceImport })
      }
    };
  },

  show(pId, id) {
    return {
      endpoint: `/api/v1/projects/${pId}/relationships/resource_imports/${id}`,
      method: "GET",
      options: {}
    };
  },

  update(pId, id, resourceImport) {
    return {
      endpoint: `/api/v1/projects/${pId}/relationships/resource_imports/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "resource_imports", data: resourceImport })
      }
    };
  },

  fetch(pId, id) {
    return {
      endpoint: `/api/v1/projects/${pId}/relationships/resource_imports/${id}`,
      method: "POST",
      options: {}
    };
  }
};
