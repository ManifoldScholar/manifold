const collectionResource = () => ({
  type: "collectionResources",
  attributes: {
    position: 1,
    resourceCollectionId: 2
  },
  relationships: {
    resource: null,
    resourceCollection: null
  }
});

export default collectionResource;
