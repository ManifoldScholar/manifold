export default {
  index(entity, filter = {}, page = {}) {
    return {
      endpoint: `/api/v1/${entity.type}/${entity.id}/relationships/permissions`,
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  create(entity, permission) {
    return {
      endpoint: `/api/v1/${entity.type}/${entity.id}/relationships/permissions`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "permissions", data: permission })
      }
    };
  },

  update(entity, id, permission) {
    return {
      endpoint: `/api/v1/${entity.type}/${entity.id}/relationships/permissions/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "permissions", data: permission })
      }
    };
  },

  show(entity, id) {
    return {
      endpoint: `/api/v1/${entity.type}/${entity.id}/relationships/permissions/${id}`,
      method: "GET"
    };
  },

  destroy(entity, id) {
    return {
      endpoint: `/api/v1/${entity.type}/${entity.id}/relationships/permissions/${id}`,
      method: "DELETE"
    };
  }
};
