import abilities from "../structures/abilities";
import Constants from "frontend/components/project-collection/Constants";
import metadata from "../structures/metadata";

const journal = () => ({
  type: "journals",
  attributes: {
    title: "A Journal",
    descriptionFormatted:
      "The publisher can include a descriptive sentence or paragraph to help describe this Journal. If you want to go this route it might be a good idea for the text describing your journal to be a little longer than a single short sentence.",
    sortOrder: "manual",
    manuallySorted: true,
    smart: false,
    featuredOnly: false,
    numberOfProjects: null,
    tagList: [],
    icon: "lamp",
    abilities: abilities(),
    heroLayout: Constants.SQUARE,
    socialTitle: "Foo Bar",
    socialDescription: "Bar Foo"
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
          title: "The Wind in the Willows",
          subtitle: null,
          subtitleFormatted: "",
          subtitlePlaintext: "",
          titleFormatted: "The Wind in the Willows",
          titlePlaintext: "The Wind in the Willows",
          publicationDate: null,
          createdAt: "2021-04-07T22:27:24.428Z",
          updatedAt: "2021-04-07T22:28:38.829Z",
          slug: "the-wind-in-the-willows",
          avatarColor: "primary",
          avatarMeta: {
            small: {
              width: 213,
              height: 320
            },
            smallSquare: {
              width: 320,
              height: 320
            },
            smallLandscape: {
              width: 320,
              height: 200
            },
            smallPortrait: {
              width: 200,
              height: 320
            },
            medium: {
              width: 427,
              height: 640
            },
            mediumSquare: {
              width: 640,
              height: 640
            },
            mediumLandscape: {
              width: 640,
              height: 400
            },
            mediumPortrait: {
              width: 400,
              height: 640
            },
            largeLandscape: {
              width: 1280,
              height: 800
            },
            original: {
              width: 392,
              height: 588
            }
          },
          draft: false,
          finished: null,
          creatorNames: "Kenneth Grahame",
          recentlyUpdated: false,
          updated: false,
          avatarStyles: {
            small:
              "http://localhost:3020/system/project/7/3/2/732aa459-1070-4549-8256-4063b64d06c8/avatar/small-8da9a6bbf1a87abf1dd052fae9051e48.jpg",
            smallSquare:
              "http://localhost:3020/system/project/7/3/2/732aa459-1070-4549-8256-4063b64d06c8/avatar/small_square-63e2a47f19d9ef6d170a619724691833.jpg",
            smallLandscape:
              "http://localhost:3020/system/project/7/3/2/732aa459-1070-4549-8256-4063b64d06c8/avatar/small_landscape-ad2948c3d6a3e4e75e487e4321afc892.jpg",
            smallPortrait:
              "http://localhost:3020/system/project/7/3/2/732aa459-1070-4549-8256-4063b64d06c8/avatar/small_portrait-802e8f29cc0d141bdc9fd449ea6a739f.jpg",
            medium:
              "http://localhost:3020/system/project/7/3/2/732aa459-1070-4549-8256-4063b64d06c8/avatar/medium-988595b318fa70e9ee6f209e2e2099b5.jpg",
            mediumSquare:
              "http://localhost:3020/system/project/7/3/2/732aa459-1070-4549-8256-4063b64d06c8/avatar/medium_square-00eaf2fe946418097e3e40e6fc8ff0e4.jpg",
            mediumLandscape:
              "http://localhost:3020/system/project/7/3/2/732aa459-1070-4549-8256-4063b64d06c8/avatar/medium_landscape-4609b4b2562615d0ba16d90015a38b9a.jpg",
            mediumPortrait:
              "http://localhost:3020/system/project/7/3/2/732aa459-1070-4549-8256-4063b64d06c8/avatar/medium_portrait-eff81b109c59b16b0bc4c85935232c89.jpg",
            largeLandscape:
              "http://localhost:3020/system/project/7/3/2/732aa459-1070-4549-8256-4063b64d06c8/avatar/large_landscape-32d6cbc8b8756bf74b7280b24199c857.jpg",
            original:
              "http://localhost:3020/system/project/7/3/2/732aa459-1070-4549-8256-4063b64d06c8/avatar/5d99ac05fb6cbc9fa0bb386f8a74cb8c.jpg"
          },
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
