export default {
  index(filter = {}, page = {}) {
    return {
      endpoint: "/api/v1/reading_groups",
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  publicIndex(filter = {}, page = {}) {
    return {
      endpoint: "/api/v1/public_reading_groups",
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

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

  collected(id, entity) {
    return {
      eagerLoad: true,
      endpoint: `/api/v1/reading_groups/${id}/relationships/${entity}`,
      method: "GET",
      options: {}
    };
  },

  categories(id) {
    return {
      endpoint: `/api/v1/reading_groups/${id}/relationships/reading_group_categories`,
      method: "GET",
      options: {}
    };
  },

  create(readingGroup) {
    return {
      endpoint: `/api/v1/reading_groups`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "readingGroups", data: readingGroup })
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
  },

  createCategory(id, category) {
    return {
      endpoint: `/api/v1/reading_groups/${id}/relationships/reading_group_categories`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "readingGroupCategories", data: category })
      }
    };
  },

  updateCategory(groupId, categoryId, category) {
    return {
      endpoint: `/api/v1/reading_groups/${groupId}/relationships/reading_group_categories/${categoryId}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "readingGroup", data: category })
      }
    };
  },

  destroyCategory(groupId, categoryId) {
    return {
      endpoint: `/api/v1/reading_groups/${groupId}/relationships/reading_group_categories/${categoryId}`,
      method: "DELETE",
      options: {}
    };
  }
};
