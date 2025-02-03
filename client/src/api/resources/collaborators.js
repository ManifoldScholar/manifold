export default {
  index(entityType, entityId, filter = {}) {
    return {
      endpoint: `/api/v1/${entityType}/${entityId}/relationships/collaborators`,
      method: "GET",
      options: {
        params: { filter }
      }
    };
  },

  roles() {
    return {
      endpoint: `/api/v1/collaborators/roles`,
      method: "GET"
    };
  },

  create(entityType, entityId, collaborators) {
    return {
      endpoint: `/api/v1/${entityType}/${entityId}/relationships/collaborators/create_from_roles`,
      method: "POST",
      options: {
        body: JSON.stringify({ data: collaborators })
      }
    };
  },

  show(entityType, entityId, id) {
    return {
      endpoint: `/api/v1/${entityType}/${entityId}/relationships/collaborators/${id}`,
      method: "GET"
    };
  },

  destroy(entityType, entityId, filter) {
    return {
      endpoint: `/api/v1/${entityType}/${entityId}/relationships/collaborators`,
      method: "DELETE",
      options: {
        params: { filter }
      }
    };
  }
};
