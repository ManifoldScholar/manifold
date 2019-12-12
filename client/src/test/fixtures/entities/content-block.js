const contentBlock = () => ({
  type: "contentBlocks",
  attributes: {
    type: "Content::MarkdownBlock",
    position: 1,
    visible: true,
    configurable: true,
    orderable: true,
    abilities: {},
    renderable: true,
    incompleteRenderAttributes: [],
    body: "body",
    bodyFormatted: "bodyFormatted",
    style: "shaded"
  },
  relationships: {
    project: null
  }
});

export default contentBlock;
