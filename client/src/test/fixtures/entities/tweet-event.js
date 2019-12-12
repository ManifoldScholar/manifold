const tweetEvent = () => ({
  type: "events",
  attributes: {
    eventType: "tweet",
    eventTitle: "Tweet Created",
    subjectType: "Tweet",
    subjectTitle: "New Tweet",
    createdAt: "2017-04-24T23:25:50.161Z",
    attributionName: "Manifold Scholarship",
    attributionUrl: "https://twitter.com/ManifoldScholar",
    attributionIdentifier: "ManifoldScholar",
    excerpt: "Manifold is great!"
  }
});

export default tweetEvent;
