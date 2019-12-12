import metadata from "../structures/metadata";
import abilities from "../structures/abilities";

const text = () => ({
  type: "texts",
  attributes: {
    metadataProperties: Object.keys(metadata()),
    slug: "",
    title: "Ain't No Thang",
    titleFormatted: "Ain't No Thang",
    titlePlaintext: "Ain't No Thang",
    creatorNames: "Andre3000, Big Boi",
    createdAt: "2017-04-24T23:25:50.161Z",
    published: true,
    coverStyles: {},
    rights: "All Rights Reserved",
    publicationDate: "2001-12-04",
    toc: ["Chapter 1", "Chapter 2"],
    abilities: abilities(),
    metadata: metadata(),
    metadataFormatted: metadata()
  },
  relationships: {
    project: "project",
    category: "category",
    stylesheets: ["stylesheet"]
  }
});

export default text;
