import abilities from "../structures/abilities";

const volume = () => ({
  type: "journalVolumes",
  id: "732aa459-1070-4549-8256-4063b64d06c8",
  attributes: {
    title: "Volume 23",
    titleFormatted: "Volume 23",
    titlePlaintext: "Volume 23",
    descriptionFormatted:
      "The publisher can include a descriptive sentence or paragraph to help describe this Volume. If you want to go this route it might be a good idea for the text describing your journal volume to be a little longer than a single short sentence.",
    publicationDate: undefined,
    createdAt: "2021-04-07T22:27:24.428Z",
    updatedAt: "2021-04-07T22:28:38.829Z",
    slug: "volume-23",
    draft: false,
    finished: null,
    creatorNames: "PennWell Publishing Company",
    recentlyUpdated: false,
    updated: false,
    avatarStyles: {},
    collectedByCurrentUser: false,
    abilities: abilities()
  },
  relationships: {
    issues: [],
    parent: {}
  },
  meta: {
    partial: true
  }
});

export default volume;
