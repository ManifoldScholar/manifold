export default {
  show() {
    return {
      endpoint: "/api/v1/me",
      method: "GET",
      options: {}
    };
  },

  update(me) {
    return {
      endpoint: "/api/v1/me",
      method: "PUT",
      options: {
        body: JSON.stringify({ data: { type: "user", attributes: me } })
      }
    };
  },

  annotations(filter = {}, page = {}) {
    return {
      endpoint: `/api/v1/me/relationships/annotations`,
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  readingGroups(filter = {}, page = {}) {
    return {
      endpoint: `/api/v1/me/relationships/reading_groups`,
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  myCollection() {
    return {
      endpoint: "/api/v1/me/relationships/collection",
      method: "GET",
      options: {}
    };
  },

  myCollected(entity, page = {}) {
    return {
      endpoint: `/api/v1/me/relationships/${entity}`,
      method: "GET",
      options: {
        params: { page }
      }
    };
  }
};
