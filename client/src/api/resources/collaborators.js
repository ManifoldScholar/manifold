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

  create(collaborators) {
    return {
      endpoint: `/api/v1/collaborators`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "collaborators", data: collaborators })
      }
    };
  },

  show(entityType, entityId, id) {
    return {
      endpoint: `/api/v1/${entityType}/${entityId}/relationships/permissions/${id}`,
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
