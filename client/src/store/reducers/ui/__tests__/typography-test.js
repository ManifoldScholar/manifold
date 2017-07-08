import typographyReducer from "../typography";
import { initialState } from "../typography";

describe("store/reducers/ui/typography", () => {
  it("should return the initial state", () => {
    const state = typographyReducer(undefined, { type: "SOME_ACTION" });
    // Must mirror initial state declared in '../typography'
    expect(state).toEqual(initialState);
  });
});

describe("store/reducers/ui/typography/selectFont", () => {
  it("should set the value as the payload", () => {
    const initialState = {
      font: "serif"
    };

    const action = { type: "SELECT_FONT", payload: "sans-serif" };
    const state = typographyReducer(initialState, action);
    expect(state).toEqual({
      font: "sans-serif"
    });
  });
});

describe("store/reducers/ui/typography/incrementFontSize", () => {
  it("Should increment the value by 1", () => {
    const initialState = {
      fontSize: {
        current: 1,
        max: 5
      }
    };

    const action = { type: "INCREMENT_FONT_SIZE" };
    const state = typographyReducer(initialState, action);
    expect(state).toEqual({
      fontSize: {
        current: 2,
        max: 5
      }
    });
  });

  it("Should return the same value if it is at maximum", () => {
    const initialState = {
      fontSize: {
        current: 5,
        max: 5
      }
    };

    const action = { type: "INCREMENT_FONT_SIZE" };
    const state = typographyReducer(initialState, action);
    expect(state).toEqual(initialState);
  });
});

describe("store/reducers/ui/typography/decrementFontSize", () => {
  it("Should decrement the value by 1", () => {
    const initialState = {
      fontSize: {
        current: 1,
        min: -5
      }
    };

    const action = { type: "DECREMENT_FONT_SIZE" };
    const state = typographyReducer(initialState, action);
    expect(state).toEqual({
      fontSize: {
        current: 0,
        min: -5
      }
    });
  });

  it("Should return the same value if it is at minimum", () => {
    const initialState = {
      fontSize: {
        current: -5,
        min: -5
      }
    };

    const action = { type: "DECREMENT_FONT_SIZE" };
    const state = typographyReducer(initialState, action);
    expect(state).toEqual(initialState);
  });
});

describe("store/reducers/ui/typography/incrementMargins", () => {
  it("Should increment the value by 1", () => {
    const initialState = {
      margins: {
        current: 1,
        max: 2
      }
    };

    const action = { type: "INCREMENT_MARGINS" };
    const state = typographyReducer(initialState, action);
    expect(state).toEqual({
      margins: {
        current: 2,
        max: 2
      }
    });
  });

  it("Should return the same value if it is at maximum", () => {
    const initialState = {
      margins: {
        current: 2,
        max: 2
      }
    };

    const action = { type: "INCREMENT_MARGINS" };
    const state = typographyReducer(initialState, action);
    expect(state).toEqual(initialState);
  });
});

describe("store/reducers/ui/typography/decrementMargins", () => {
  it("Should decrement the value by 1", () => {
    const initialState = {
      margins: {
        current: 1,
        min: 0
      }
    };

    const action = { type: "DECREMENT_MARGINS" };
    const state = typographyReducer(initialState, action);
    expect(state).toEqual({
      margins: {
        current: 0,
        min: 0
      }
    });
  });

  it("Should return the same value if it is at minimum", () => {
    const initialState = {
      margins: {
        current: 0,
        min: 0
      }
    };

    const action = { type: "DECREMENT_MARGINS" };
    const state = typographyReducer(initialState, action);
    expect(state).toEqual(initialState);
  });
});
