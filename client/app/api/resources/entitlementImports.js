export default {
  index(filter = {}, page = {}) {
    return {
      endpoint: `/api/v1/entitlement_imports`,
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  create(entitlement) {
    return {
      endpoint: `/api/v1/entitlement_imports`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "entitlement_imports", data: entitlement })
      }
    };
  }
};
