import filterReducer from "../filters";

describe("store/reducers/ui/filters", () => {
  it("should return the initial state", () => {
    const state = filterReducer(undefined, { type: "SOME_ACTION" });
    expect(state).toEqual({ project: {} });
  });

  it("should set the project filter correctly", () => {
    const action = {
      type: "SET_PROJECT_FILTERS",
      payload: { published: true }
    };
    const state = filterReducer({}, action);
    expect(state).toEqual({ project: { published: true } });
  });
});
