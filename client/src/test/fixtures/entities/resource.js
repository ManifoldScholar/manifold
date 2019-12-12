import metadata from "../structures/metadata";
import abilities from "../structures/abilities";

const resource = () => ({
  type: "resources",
  attributes: {
    title: "Image",
    slug: "",
    projectSlug: "delegated-project-slug",
    titleFormatted: "Image",
    kind: "image",
    attachmentStyles: {
      original: "original-image.mock",
      medium: null,
      mediumSquare: "original-image.mock"
    },
    descriptionFormatted: "Black and white freckles",
    createdAt: "2017-04-24T23:25:50.161Z",
    captionFormatted: "World's Greatest Dog",
    downloadable: true,
    tagList: ["dog", "puppy", "GOAT"],
    abilities: abilities(),
    metadata: metadata(),
    metadataFormatted: metadata()
  },
  relationships: {
    collectionResources: []
  }
});

export default resource;
