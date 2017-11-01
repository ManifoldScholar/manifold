import colorsReducer from "../colors";

describe("store/reducers/ui/colors", () => {
  it("should return the initial state", () => {
    const state = colorsReducer(undefined, { type: "SOME_ACTION" });
    // Must mirror initial state declared in '../typography'
    expect(state).toEqual({
      colorScheme: "light"
    });
  });
});

describe("store/reducers/ui/typography/setColorScheme", () => {
  it("should set the value as the payload", () => {
    const initialState = {
      colorScheme: "light"
    };

    const action = { type: "SET_COLOR_SCHEME", payload: "dark" };
    const state = colorsReducer(initialState, action);
    expect(state).toEqual({
      colorScheme: "dark"
    });
  });
});
