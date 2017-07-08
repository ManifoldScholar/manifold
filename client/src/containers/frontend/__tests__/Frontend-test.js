import React from "react";
import renderer from "react-test-renderer";
import { FrontendContainer } from "../Frontend";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";

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
    }
  };

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <FrontendContainer {...props} />
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
