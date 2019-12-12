const actionCallout = () => ({
  type: "actionCallouts",
  attributes: {
    title: "Start Reading",
    kind: "link",
    location: "left",
    position: 1,
    url: "https://github.com/ManifoldScholar/manifold",
    externalLink: true,
    button: true
  },
  relationships: {
    project: null
  }
});

export default actionCallout;
