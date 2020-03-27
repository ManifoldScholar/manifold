export default {
  index(entity, filter = {}, page = {}) {
    return {
      endpoint: `/api/v1/${entity.type}/${entity.id}/relationships/entitlements`,
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  create(entity, entitlement) {
    return {
      endpoint: `/api/v1/${entity.type}/${entity.id}/relationships/entitlements`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "entitlements", data: entitlement })
      }
    };
  },

  show(_entity, id) {
    return {
      endpoint: `/api/v1/entitlements/${id}`,
      method: "GET"
    };
  },

  destroy(_entity, id) {
    return {
      endpoint: `/api/v1/entitlements/${id}`,
      method: "DELETE"
    };
  }
};
