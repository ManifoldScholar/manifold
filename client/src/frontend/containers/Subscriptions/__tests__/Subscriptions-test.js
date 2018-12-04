jest.mock("react-collapse");

import React from "react";
import renderer from "react-test-renderer";
import { SubscriptionsContainer } from "../";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";
import auth from "test/helpers/auth";

describe("Frontend Subscriptions Container", () => {
  const store = build.store();
  const notificationPreferences = {
    digest: "daily",
    followedProjects: "always",
    annotationsAndComments: "always",
    repliesToMe: "always"
  };
  const user = build.entity.user("1", { notificationPreferences });
  const authentication = {
    authenticated: true,
    currentUser: user
  };

  const component = () =>
    renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <SubscriptionsContainer
            authentication={authentication}
            dispatch={store.dispatch}
          />
        </Provider>
      )
    );

  it("renders correctly", () => {
    auth.startSession(store.dispatch, user);
    let tree = component().toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render to null", () => {
    auth.startSession(store.dispatch, user);
    let tree = component().toJSON();
    expect(tree).not.toBe(null);
  });
});
