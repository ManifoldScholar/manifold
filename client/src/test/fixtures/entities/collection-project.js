const collectionProject = () => ({
  type: "collectionProjects",
  attributes: {
    position: 1
  },
  relationships: {
    project: "project",
    projectCollection: "projectCollection"
  }
});

export default collectionProject;
