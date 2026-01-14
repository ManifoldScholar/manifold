export default {
  create({ data, userGroupId }) {
    return {
      endpoint: `/api/v1/user_groups/${userGroupId}/relationships/user_group_entitleables`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "userGroupEntitlements", data })
      }
    };
  },

  destroy({ id, userGroupId }) {
    return {
      endpoint: `/api/v1/user_groups/${userGroupId}/relationships/user_group_entitleables/${id}`,
      method: "DELETE",
      options: {}
    };
  }
};
