import abilities from "../structures/abilities";

const resourceCollection = () => ({
  type: "resourceCollections",
  attributes: {
    title: "Rowan",
    slug: "",
    collectionResourcesCount: 0,
    createdAt: "2017-04-24T23:25:50.161Z",
    resourceKinds: ["image", "video"],
    resourceTags: ["dog"],
    thumbnailStyles: {},
    abilities: abilities()
  },
  relationships: {
    resources: ["resource"],
    project: "project"
  }
});

export default resourceCollection;
