import abilities from "../structures/abilities";

const projectCollection = () => ({
  type: "projectCollections",
  attributes: {
    title: "A Project Collection",
    description: "A description of the project collection",
    sortOrder: "manual",
    manuallySorted: true,
    smart: false,
    featuredOnly: false,
    numberOfProjects: null,
    tagList: [],
    icon: "lamp",
    abilities: abilities(),

    // mocked content
    metaDescription: {},
    heroLayout: "square_inset"
  },
  relationships: {
    collectionProjects: [],
    subjects: [],
    projects: []
  }
});

export default projectCollection;
