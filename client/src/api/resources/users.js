export default {
  whoami() {
    return {
      endpoint: "/api/v1/users/whoami",
      method: "GET",
      options: {}
    };
  },

  index(filter = {}, page = {}) {
    return {
      endpoint: "/api/v1/users",
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  update(id, user) {
    return {
      endpoint: `/api/v1/users/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "user", data: user })
      }
    };
  },

  show(id) {
    return {
      endpoint: `/api/v1/users/${id}`,
      method: "GET",
      options: {}
    };
  },

  create(user) {
    return {
      endpoint: "/api/v1/users",
      method: "POST",
      options: {
        body: JSON.stringify({ type: "user", data: user })
      }
    };
  },

  destroy(id) {
    return {
      endpoint: `/api/v1/users/${id}`,
      method: "DELETE",
      options: {}
    };
  }
};
