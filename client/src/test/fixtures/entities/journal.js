import abilities from "../structures/abilities";
import metadata from "../structures/metadata";

const journal = () => ({
  type: "journals",
  attributes: {
    title: "Computer Design",
    titleFormatted: "Computer Design",
    titlePlaintext: "Computer Design",
    descriptionFormatted:
      "The publisher can include a descriptive sentence or paragraph to help describe this Journal. If you want to go this route it might be a good idea for the text describing your journal to be a little longer than a single short sentence.",
    subtitle: null,
    darkMode: false,
    heroStyles: {},
    coverStyles: {},
    avatarStyles: {},
    avatarMeta: {},
    avatarColor: "primary",
    icon: "lamp",
    abilities: abilities(),
    metadataProperties: Object.keys(metadata()),
    metadata: metadata(),
    metadataFormatted: metadata(),
    twitterId: "test",
    instagramId: "test",
    facebookId: "test"
  },
  relationships: {
    collectionProjects: [],
    subjects: [],
    volumes: [
      {
        id: "732aa459-1070-4549-8256-4063b64d06c8",
        type: "volumes",
        attributes: {
          abilities: {
            read: true
          },
          title: "Volume 23",
          titleFormatted: "Volume 23",
          titlePlaintext: "Volume 23",
          publicationDate: null,
          createdAt: "2021-04-07T22:27:24.428Z",
          updatedAt: "2021-04-07T22:28:38.829Z",
          slug: "volume-23",
          avatarColor: "primary",
          avatarMeta: {},
          draft: false,
          finished: null,
          creatorNames: "Kenneth Grahame",
          recentlyUpdated: false,
          updated: false,
          avatarStyles: {},
          collectedByCurrentUser: false
        },
        relationships: {
          issues: []
        },
        meta: {
          partial: true
        }
      }
    ]
  }
});

export default journal;
