export const project = (abilities = {}) => {
  const project = factory("project", {
    attributes: {
      abilities
    }
  });
  project.relationships.creators = [
    factory("maker", {
      id: "creator-1"
    }),
    factory("maker", {
      id: "creator-2"
    })
  ];
  project.relationships.textCategories = [
    factory("textCategory", {
      id: "textCategory-1"
    }),
    factory("textCategory", {
      id: "textCategory-2"
    })
  ];
  project.relationships.contributors = [
    factory("maker", {
      id: "contributor-1"
    }),
    factory("maker", {
      id: "contributor-2"
    })
  ];
  return project;
};

export const route = () => ({
  routes: [],
  options: {}
});

export default { project, route };
