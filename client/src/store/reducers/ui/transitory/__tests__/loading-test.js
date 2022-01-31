import loadingReducer from "../loading";

/* eslint-disable no-unused-expressions */
describe("store/reducers/ui/loading", () => {
  it("should return the initial state", () => {
    const state = loadingReducer(undefined, { type: "SOME_ACTION" });
    expect(state).toEqual({
      active: false,
      activeLoaders: [],
      pendingRemovals: []
    });
  });

  it("set the correct state in response to a START_LOADING action", () => {
    const initialState = { active: false, activeLoaders: [] };
    const promise = new Promise(() => {});
    const action = { type: "START_LOADING", payload: promise };
    const state = loadingReducer(initialState, action);
    expect(state.active).toBe(true);
  });

  it("sets the active state to false when a START_LOADING promise is resolved", done => {
    const initialState = { active: false, activeLoaders: [] };
    const promise = new Promise(resolve => {
      resolve(true);
    });
    const startAction = { type: "START_LOADING", payload: promise };
    const startState = loadingReducer(initialState, startAction);
    promise
      .then(() => {
        const stopAction = { type: "STOP_LOADING", payload: promise };
        const stopState = loadingReducer(startState, stopAction);
        expect(stopState.active).toBe(false);
        done();
      })
      .catch(() => {});
  });
});
/* eslint-enable no-unused-expressions */
