import entityStoreReducer from "../entityStore";
import { initialState } from "../entityStore";

describe("store/reducers/entityStore", () => {
  const model = {
    id: "1",
    type: "texts",
    attributes: {
      anAttribute: "test"
    }
  };

  const apiCollectionResponse = {
    data: [
      {
        id: "1",
        type: "texts",
        attributes: {
          slug: "slug-1"
        },
        meta: {
          partial: true
        }
      },
      {
        id: "2",
        type: "texts",
        attributes: {
          slug: "slug-2"
        },
        meta: {
          partial: true
        }
      }
    ]
  };

  const apiShowResponse = {
    data: {
      id: "1",
      type: "texts",
      attributes: {
        foo: "bar"
      },
      meta: {
        partial: false
      }
    }
  };

  it("should return the initial state", () => {
    const state = entityStoreReducer(undefined, {
      type: "SOME UNRELATED ACTION"
    });
    expect(state).toEqual(initialState);
  });

  it("should store a single model in the entity story", () => {
    const state = entityStoreReducer(undefined, {
      meta: "test-response",
      payload: apiShowResponse,
      type: "API_RESPONSE"
    });
    expect(state.entities.texts["1"]).toEqual(apiShowResponse.data);
  });

  it("should store a collection of models in the entity story", () => {
    const state = entityStoreReducer(undefined, {
      meta: "test-response",
      payload: apiCollectionResponse,
      type: "API_RESPONSE"
    });
    expect(state.entities.texts["1"]).toEqual(apiCollectionResponse.data[0]);
    expect(state.entities.texts["2"]).toEqual(apiCollectionResponse.data[1]);
  });

  it("should maintain a map of slugs to IDs", () => {
    const state = entityStoreReducer(undefined, {
      meta: "test-response",
      payload: apiCollectionResponse,
      type: "API_RESPONSE"
    });
    expect(state.slugMap.texts["slug-1"]).toEqual("1");
    expect(state.slugMap.texts["slug-2"]).toEqual("2");
  });

  it("should update the slug map if a slug changes", () => {
    let state = entityStoreReducer(undefined, {
      meta: "test-response",
      payload: apiCollectionResponse,
      type: "API_RESPONSE"
    });
    state = entityStoreReducer(state, {
      meta: "test-response",
      payload: {
        data: [
          {
            id: "1",
            type: "texts",
            attributes: {
              slug: "adjusted-slug-1"
            },
            meta: {
              partial: true
            }
          }
        ]
      },
      type: "API_RESPONSE"
    });
    expect(state.slugMap.texts["adjusted-slug-1"]).toEqual("1");
  });

  it("should not overwrite an existing entity with a partial entity", () => {
    const stateA = entityStoreReducer(undefined, {
      meta: "test-response",
      payload: apiShowResponse,
      type: "API_RESPONSE"
    });
    const stateB = entityStoreReducer(stateA, {
      meta: "test-response",
      payload: apiCollectionResponse,
      type: "API_RESPONSE"
    });
    expect(stateB.entities.texts["1"].attributes.foo).toEqual("bar");
  });

  it("should not mutate meta object", () => {
    const stateA = entityStoreReducer(undefined, {
      meta: "test-response",
      payload: apiCollectionResponse,
      type: "API_RESPONSE"
    });
    const firstMeta = stateA.responses["test-response"].meta;

    const stateB = entityStoreReducer(stateA, {
      meta: "test-response",
      payload: apiCollectionResponse,
      type: "API_RESPONSE"
    });
    const secondMeta = stateB.responses["test-response"].meta;

    expect(firstMeta).not.toBe(secondMeta);
  });
});
