function mapCollectionIdentity(collection) {
  const type = collection.type;
  const isUser = type === "users";
  const identityKey = isUser ? "lid" : "id";
  const identity = isUser ? "me" : collection.id;
  return { type, identityKey, identity };
}

function collectionRef(collection) {
  const { type, identityKey, identity } = mapCollectionIdentity(collection);
  return {
    type,
    [identityKey]: identity,
    relationship: "collection"
  };
}

function mapCollectables(collectables) {
  return collectables.map(collectable => ({
    collectableType: collectable.type,
    collectableId: collectable.id
  }));
}

function makePayload(operation, collectables, collection) {
  return {
    "atomic:operations": [
      {
        op: operation,
        ref: collectionRef(collection),
        data: mapCollectables(collectables)
      }
    ]
  };
}

const endpoint = "/api/v1/operations";
const method = "POST";

export default {
  collect(collectables, collection = { type: "users" }) {
    return {
      endpoint,
      method,
      options: {
        body: JSON.stringify(makePayload("update", collectables, collection))
      }
    };
  },

  remove(collectables, collection = { type: "users" }) {
    return {
      endpoint,
      method,
      options: {
        body: JSON.stringify(makePayload("remove", collectables, collection))
      }
    };
  }
};
