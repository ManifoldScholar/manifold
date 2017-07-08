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
});
