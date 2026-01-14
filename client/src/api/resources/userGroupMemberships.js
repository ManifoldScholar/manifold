export default {
  create({ id, userGroupId }) {
    const data = {
      relationships: {
        user: {
          data: { id }
        }
      }
    };

    return {
      endpoint: `/api/v1/user_groups/${userGroupId}/relationships/user_group_memberships`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "userGroupMemberships", data })
      }
    };
  },

  destroy({ id, userGroupId }) {
    return {
      endpoint: `/api/v1/user_groups/${userGroupId}/relationships/user_group_memberships/${id}`,
      method: "DELETE",
      options: {}
    };
  }
};
