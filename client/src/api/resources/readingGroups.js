export default {
  show(id) {
    return {
      endpoint: `/api/v1/reading_groups/${id}`,
      method: "GET",
      options: {}
    };
  },

  destroy(id) {
    return {
      endpoint: `/api/v1/reading_groups/${id}`,
      method: "DELETE",
      options: {}
    };
  },

  members(id, filter = {}, page = {}) {
    return {
      endpoint: `/api/v1/reading_groups/${id}/relationships/reading_group_memberships`,
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  annotations(id, filter = {}, page = {}) {
    return {
      endpoint: `/api/v1/reading_groups/${id}/relationships/annotations`,
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  create(readingGroup) {
    return {
      endpoint: `/api/v1/reading_groups`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "readingsGroups", data: readingGroup })
      }
    };
  },

  update(id, readingGroup) {
    return {
      endpoint: `/api/v1/reading_groups/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "readingGroup", data: readingGroup })
      }
    };
  }
};
