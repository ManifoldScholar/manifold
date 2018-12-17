const fakeProject = {
  id: 1,
  attributes: {
    updatedAt: 123
  },
  relationships: {
    contentBlocks: [
      {
        id: 1,
        type: "Content::TOCBlock",
        attributes: {
          position: 0
        }
      },
      {
        id: 2,
        type: "Content::ResourcesBlock",
        attributes: {
          position: 1
        }
      },
      {
        id: 3,
        type: "Content::MarkdownBlock",
        attributes: {
          position: 2
        }
      }
    ]
  }
};

export default fakeProject;
