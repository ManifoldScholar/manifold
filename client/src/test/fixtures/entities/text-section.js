import metadata from "../structures/metadata";

const textSection = () => ({
  type: "textSections",
  kind: "section",
  sourceIdentifier: "ro-dintl-001",
  attributes: {
    name: "Title Page",
    metadataProperties: Object.keys(metadata()),
    bodyJSON: {
      tag: "section",
      nodeType: "element",
      attributes: {
        id: "RO",
        type: "titlepage",
        class: "chapter"
      },
      children: {
        0: {
          tag: "h1",
          nodeType: "element",
          attributes: {},
          children: {
            0: {
              content: "A day in the life of Rowan",
              nodeType: "text",
              nodeUuid: "1234-5678-9000",
              textDigest: "1234-5678-9000"
            }
          }
        }
      }
    }
  }
});

export default textSection;
