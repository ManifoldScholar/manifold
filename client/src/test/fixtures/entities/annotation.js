import metadata from "../structures/metadata";
import abilities from "../structures/abilities";

const annotation = () => ({
  type: "annotations",
  attributes: {
    createdAt: "2017-04-24T23:25:50.161Z",
    subject: "Gods, Earths, and 85ers",
    body:
      "Hands on your boxes, turn 'em up like seven notches." +
      " Your Magnavoxes amplify my super conscious.",
    startNode: "some-node",
    creatorAvatarStyles: {},
    endNode: "another-node",
    startChar: 4,
    endChar: 13,
    abilities: abilities()
  },
  relationships: {
    creator: {
      attributes: {
        fullName: "Harry Henderson",
        firstName: "Harry",
        lastName: "Henderson"
      }
    },
    textSection: {
      attributes: {
        name: "Title Page",
        textTitle: "Hail Seitan",
        metadataProperties: Object.keys(metadata())
      }
    }
  }
});

export default annotation;
