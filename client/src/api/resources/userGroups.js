export default {
  index(filter = {}, page = {}) {
    return {
      endpoint: "/api/v1/user_groups",
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  show(id) {
    return {
      endpoint: `/api/v1/user_groups/${id}`,
      method: "GET",
      options: {}
    };
  },

  update(id, userGroup) {
    return {
      endpoint: `/api/v1/user_groups/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "userGroup", data: userGroup })
      }
    };
  },

  create(userGroup) {
    return {
      endpoint: "/api/v1/user_groups",
      method: "POST",
      options: {
        body: JSON.stringify({ type: "userGroup", data: userGroup })
      }
    };
  },

  destroy(id) {
    return {
      endpoint: `/api/v1/user_groups/${id}`,
      method: "DELETE",
      options: {}
    };
  }
};
