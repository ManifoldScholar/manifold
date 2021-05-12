import abilities from "../structures/abilities";

const volume = () => ({
  type: "journalVolumes",
  attributes: {
    title: "A Journal Volume",
    descriptionFormatted:
      "The publisher can include a descriptive sentence or paragraph to help describe this Volume. If you want to go this route it might be a good idea for the text describing your journal volume to be a little longer than a single short sentence.",
    sortOrder: "manual",
    manuallySorted: true,
    smart: false,
    featuredOnly: false,
    numberOfProjects: null,
    tagList: [],
    icon: "lamp",
    abilities: abilities(),
    socialTitle: "Foo Bar",
    socialDescription: "Bar Foo"
  },
  relationships: {
    issues: [],
    parent: {
      type: "Journal",
      name: "The Gadfly"
    }
  }
});

export default volume;
