const permission = () => ({
  type: "permissions",
  attributes: {
    roleNames: ["project_author"]
  },
  relationships: {
    resource: null,
    user: null
  }
});

export default permission;
