const fakeProject = {
  id: "76a42bd8-3441-4922-ab13-241012a9b83c", // TODO: In case I accidentally commit, this is a real project ID in my db
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
