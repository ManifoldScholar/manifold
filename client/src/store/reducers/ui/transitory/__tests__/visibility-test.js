import visibilityReducer from "../visibility";
import { initialState } from "../visibility";
import cloneDeep from "lodash/cloneDeep";

describe("store/reducers/ui/visibility", () => {
  it("should return the initial state", () => {
    const state = visibilityReducer(undefined, { type: "SOME_ACTION" });
    // Must mirror initial state declared in '../visibility'
    expect(state).toEqual(initialState);
  });
});

describe("store/reducers/ui/visibility/panelToggle", () => {
  it("should set a single panel to true if it is false", () => {
    const initialState = {
      uiPanels: {
        user: false,
        appearance: false
      }
    };

    const action = { type: "PANEL_TOGGLE", payload: "appearance" };
    const state = visibilityReducer(initialState, action);
    expect(state).toEqual({
      uiPanels: {
        user: false,
        appearance: true
      }
    });
  });

  it(
    "should set a single panel in panelSolo object to true, and set all other panels " +
      "to false",
    () => {
      const initialState = {
        uiPanels: {
          user: true,
          appearance: false,
          layers: true
        }
      };
      const action = { type: "PANEL_TOGGLE", payload: "appearance" };
      const state = visibilityReducer(initialState, action);
      expect(state).toEqual({
        uiPanels: {
          user: false,
          appearance: true,
          layers: false
        }
      });
    }
  );

  it("should set a single panel to false if it is true", () => {
    const initialState = {
      uiPanels: {
        user: false,
        appearance: true
      }
    };
    const action = { type: "PANEL_TOGGLE", payload: "appearance" };
    const state = visibilityReducer(initialState, action);
    expect(state).toEqual({
      uiPanels: {
        user: false,
        appearance: false
      }
    });
  });

  it("should set a single panel to false without affecting other panels", () => {
    const initialState = {
      uiPanels: {
        user: true,
        appearance: true
      }
    };
    const action = { type: "PANEL_TOGGLE", payload: "appearance" };
    const state = visibilityReducer(initialState, action);
    expect(state).toEqual({
      uiPanels: {
        user: true,
        appearance: false
      }
    });
  });
});

describe("store/reducers/ui/visibility/panelShow", () => {
  it("should set a single panel to true", () => {
    const initialState = {
      uiPanels: {
        user: false,
        appearance: false
      }
    };

    const action = { type: "PANEL_SHOW", payload: "appearance" };
    const state = visibilityReducer(initialState, action);
    expect(state).toEqual({
      uiPanels: {
        user: false,
        appearance: true
      }
    });
  });

  it(
    "should set a single panel in panelSolo object to true, and set all other panels " +
      "to false",
    () => {
      const initialState = {
        uiPanels: {
          user: true,
          appearance: false,
          layers: true
        }
      };
      const action = { type: "PANEL_SHOW", payload: "appearance" };
      const state = visibilityReducer(initialState, action);
      expect(state).toEqual({
        uiPanels: {
          user: false,
          appearance: true,
          layers: false
        }
      });
    }
  );
});

describe("store/reducers/ui/visibility/panelHide", () => {
  it("should set a single panel to false", () => {
    const initialState = {
      uiPanels: {
        user: false,
        appearance: true
      }
    };
    const action = { type: "PANEL_HIDE", payload: "appearance" };
    const state = visibilityReducer(initialState, action);
    expect(state).toEqual({
      uiPanels: {
        user: false,
        appearance: false
      }
    });
  });
});

describe("store/reducers/ui/visibility/panelHide", () => {
  const inState = cloneDeep(initialState);
  inState.visibilityFilters.highlight.yours = false;
  inState.visibilityFilters.annotation.yours = false;
  it("should show annotations for the current user", () => {
    const action = { type: "SHOW_MY_NOTES", payload: "appearance" };
    const outState = visibilityReducer(inState, action);
    expect(outState.visibilityFilters.highlight.yours).toEqual(true);
    expect(outState.visibilityFilters.annotation.yours).toEqual(true);
  });
});
