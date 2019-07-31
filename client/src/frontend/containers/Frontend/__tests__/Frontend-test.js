import React from "react";
import renderer from "react-test-renderer";
import { FrontendContainer } from "../";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";
import { FrontendModeContext } from "helpers/contexts";

describe("Frontend Frontend Container", () => {
  const store = build.store();
  const props = {
    notifications: {
      notifications: []
    },
    history: {},
    route: {
      routes: []
    },
    location: {},
    visibility: {
      uiPanels: {}
    },
    authentication: {
      authenticated: true,
      currentUser: build.entity.user("1")
    },
    settings: build.entity.settings("0")
  };

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <FrontendModeContext.Provider
          value={{ isLibrary: true, isStandalone: false }}
        >
          <FrontendContainer {...props} />
        </FrontendModeContext.Provider>
      </Provider>
    )
  );

  it("renders correctly", () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render to null", () => {
    let tree = component.toJSON();
    expect(tree).not.toBe(null);
  });
});
