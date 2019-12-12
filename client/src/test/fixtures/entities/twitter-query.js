const twitterQuery = () => ({
  type: "twitterQueries",
  attributes: {
    query: "from:manifoldscholar",
    active: true,
    resultsType: "most_recent",
    eventsCount: 0
  },
  relationships: {
    project: "project"
  }
});

export default twitterQuery;
