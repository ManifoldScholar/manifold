import React from "react";
import renderer from "react-test-renderer";
import { UsersWrapperContainer } from "../Wrapper";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Backend People Wrapper Container", () => {
  const children = <div>How is babby formed?</div>;
  const store = build.store();
  store.dispatch({
    type: "UPDATE_CURRENT_USER",
    error: false,
    payload: {
      data: build.entity.user("1")
    }
  });

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <UsersWrapperContainer children={children} route={{ routes: [] }} />
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
