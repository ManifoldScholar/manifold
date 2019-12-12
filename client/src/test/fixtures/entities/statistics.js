const statistics = () => ({
  type: "statistics",
  attributes: {
    newTextsCount: 5,
    newHighlightsCount: 4,
    newAnnotationsCount: 3,
    readerIncrease: 50,
    readersThisWeek: 2
  },
  relationships: {
    text: null
  }
});

export default statistics;
