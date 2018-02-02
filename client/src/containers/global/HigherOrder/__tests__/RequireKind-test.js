import React from "react";
import renderer from "react-test-renderer";
import { RequireKindWrapper } from "../RequireKind";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";

describe("Global HigherOrder RequireKind Container", () => {
  const store = build.store();
  const authentication = {
    authenticated: true,
    currentUser: build.entity.user("1")
  };
  const child = <div>How is babby formed?</div>;

  it("renders correctly when role matches", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <RequireKindWrapper
            roleMatchBehavior="show"
            requiredKind="any"
            authentication={authentication}
            children={child}
          />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly to null when role doesn't match", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <RequireKindWrapper
            roleMatchBehavior="show"
            requiredKind="any"
            authentication={{}}
            children={child}
          />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
