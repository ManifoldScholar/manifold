export const project = () => {
  const project = factory("project", {
    relationships: {
      categories: [
        factory("category", { id: "1" }),
        factory("category", { id: "2" })
      ]
    }
  });
  project.relationships.texts = [
    factory("text", {
      id: "3",
      relationships: {
        project: project,
        category: project.relationships.categories[0]
      }
    }),
    factory("text", {
      id: "4",
      relationships: {
        project: project,
        category: project.relationships.categories[0]
      }
    })
  ];
  return project;
};

export default { project };
