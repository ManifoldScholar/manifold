export default {
  create({ userId, readingGroupId }) {
    const data = {
      relationships: {
        user: {
          data: { id: userId }
        },
        readingGroup: {
          data: { id: readingGroupId }
        }
      }
    };

    return {
      endpoint: `/api/v1/reading_group_memberships`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "readingsGroups", data })
      }
    };
  },

  destroy(id) {
    return {
      endpoint: `/api/v1/reading_group_memberships/${id}`,
      method: "DELETE",
      options: {}
    };
  },

  show(id) {
    return {
      endpoint: `/api/v1/reading_group_memberships/${id}`,
      method: "GET",
      options: {}
    };
  },

  update(id, data) {
    return {
      endpoint: `/api/v1/reading_group_memberships/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "readingGroupMemberships", data })
      }
    };
  }
};
