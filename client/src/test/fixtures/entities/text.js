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
    toc: [
      {
        label: "Cover",
        anchor: "cvi",
        id: "AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE"
      },
      {
        label: "Title Page",
        anchor: "bk",
        id: "AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE"
      },
      {
        label: "Copyright Page",
        anchor: "cip",
        id: "AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE"
      },
      {
        label: "Contents",
        anchor: "toc",
        id: "AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE"
      },
      {
        label: "Chapter 1",
        anchor: "ch01",
        children: [
          {
            label: "Chapter 1 Section 1",
            anchor: "ch01sec01",
            id: "AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE"
          },
          {
            label: "Chapter 1 Section 2",
            anchor: "ch01sec02",
            id: "AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE",
            children: [
              {
                label: "Chapter 1 Section 2 Subsection 1",
                anchor: "ch01sec01subsec01",
                id: "AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE"
              }
            ]
          }
        ],
        id: "AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE"
      }
    ],
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
