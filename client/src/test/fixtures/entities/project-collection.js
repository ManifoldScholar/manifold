import abilities from "../structures/abilities";

const projectCollection = () => ({
  type: "projectCollections",
  attributes: {
    title: "A Project Collection",
    descriptionFormatted:
      "The publisher can include a descriptive sentence or paragraph to help describe this Collection. If you want to go this route it might be a good idea for the text describing your custom collection to be a little longer than a single short sentence.",
    sortOrder: "manual",
    manuallySorted: true,
    smart: false,
    featuredOnly: false,
    numberOfProjects: null,
    tagList: [],
    icon: "lamp",
    abilities: abilities(),
    heroLayout: "square_inset",
    socialTitle: "Foo Bar",
    socialDescription: "Bar Foo"
  },
  relationships: {
    collectionProjects: [],
    subjects: [],
    projects: []
  }
});

export default projectCollection;
