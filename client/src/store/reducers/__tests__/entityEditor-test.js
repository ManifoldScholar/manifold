import entityEditorReducer from "../entityEditor";
import { entityEditorActions } from "actions";

describe("store/reducers/entityEditor", () => {
  const model = {
    id: "1",
    attributes: {
      anAttribute: "test"
    }
  };

  const session = {
    changed: false,
    dirty: { attributes: {}, relationships: {} },
    source: model
  };

  it("should return the initial state", () => {
    const state = entityEditorReducer(undefined, {
      type: "SOME UNRELATED ACTION"
    });
    expect(state).toEqual({
      sessions: {}
    });
  });

  it("should open a session", () => {
    const action = entityEditorActions.open("key", model);
    const state = entityEditorReducer(undefined, action);
    expect(state).toEqual({
      sessions: {
        key: session
      }
    });
  });

  it("should close a session", () => {
    const initialState = {
      sessions: {
        a: session,
        b: session
      }
    };
    const action = entityEditorActions.close("a");
    const state = entityEditorReducer(initialState, action);
    expect(state).toEqual({
      sessions: {
        b: session
      }
    });
  });

  it("should update a deep attribute on the dirty model", () => {
    const initialState = {
      sessions: {
        a: {
          changed: false,
          dirty: {
            id: "1",
            attributes: {
              anAttribute: "test"
            }
          }
        }
      }
    };
    const action = entityEditorActions.set(
      "a",
      "attributes.anAttribute.$set",
      "updated"
    );
    const state = entityEditorReducer(initialState, action);
    expect(state).toEqual({
      sessions: {
        a: {
          changed: true,
          dirty: {
            id: "1",
            attributes: {
              anAttribute: "updated"
            }
          }
        }
      }
    });
  });

  describe("should mutate state properly", () => {
    const anObject = {
      foo: "bar"
    };

    const initialState = {
      sessions: {
        a: {
          changed: false,
          dirty: {
            id: "1",
            attributes: {
              anAttribute: "test",
              anObjectAttribute: anObject
            }
          },
          source: {
            id: "1",
            attributes: {
              anAttribute: "test",
              anObjectAttribute: anObject
            }
          }
        }
      }
    };

    const simpleAction = entityEditorActions.set(
      "a",
      "attributes.anAttribute.$set",
      "updated"
    );

    const objectOverwriteAction = entityEditorActions.set(
      "a",
      "attributes.anObjectAttribute.$set",
      { foo: "baz" }
    );

    const objectReplaceAction = entityEditorActions.set(
      "a",
      "attributes.anObjectAttribute.$set",
      { bar: "foo" }
    );

    it("it should mutate the session model", () => {
      const state = entityEditorReducer(initialState, simpleAction);
      expect(Object.is(state.sessions.a, initialState.sessions.a)).toBe(false);
    });

    it("it should mutate the dirty model", () => {
      const state = entityEditorReducer(initialState, simpleAction);
      expect(
        Object.is(state.sessions.a.dirty, initialState.sessions.a.dirty)
      ).toBe(false);
    });

    it("it should not mutate the source model", () => {
      const state = entityEditorReducer(initialState, simpleAction);
      expect(
        Object.is(state.sessions.a.source, initialState.sessions.a.source)
      ).toBe(true);
    });

    it("it should mutate the dirty model's attributes", () => {
      const state = entityEditorReducer(initialState, simpleAction);
      expect(
        Object.is(
          state.sessions.a.dirty.attributes,
          initialState.sessions.a.dirty.attributes
        )
      ).toBe(false);
    });

    it("should not unnecessarily mutate an object attribute", () => {
      const state = entityEditorReducer(initialState, simpleAction);
      expect(
        Object.is(state.sessions.a.dirty.attributes.anObjectAttribute, anObject)
      ).toBe(true);
    });

    it("should not unnecessarily mutate an object attribute when changing a property results in no actual change", () => {
      const action = entityEditorActions.set(
        "a",
        "attributes.anAttribute.$set",
        "test"
      );
      const state = entityEditorReducer(initialState, action);
      expect(
        Object.is(state.sessions.a.dirty.attributes.anObjectAttribute, anObject)
      ).toBe(true);
    });

    it("should mutate an object attribute when necessary", () => {
      const state = entityEditorReducer(initialState, objectOverwriteAction);
      expect(
        Object.is(state.sessions.a.dirty.attributes.anObjectAttribute, anObject)
      ).toBe(false);
    });

    it("should correctly overwrite an object attribute property", () => {
      const state = entityEditorReducer(initialState, objectOverwriteAction);
      expect(state.sessions.a.dirty.attributes.anObjectAttribute.foo).toBe(
        "baz"
      );
    });

    it("should replace, not merge an object attribute", () => {
      const state = entityEditorReducer(initialState, objectReplaceAction);

      expect(state.sessions.a.dirty.attributes.anObjectAttribute.foo).toBe(
        undefined
      );
      expect(state.sessions.a.dirty.attributes.anObjectAttribute.bar).toBe(
        "foo"
      );
    });
  });
});
