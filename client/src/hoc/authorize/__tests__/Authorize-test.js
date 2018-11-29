import React from "react";
import renderer from "react-test-renderer";
import { AuthorizeComponent } from "../Authorize";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";

describe("Global HigherOrder Authorize Container", () => {
  const store = build.store();
  const authentication = {
    authenticated: true,
    currentUser: build.entity.user("1")
  };
  const child = <div>How is babby formed?</div>;

  it("renders correctly when kind matches", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <AuthorizeComponent
            kind="any"
            authentication={authentication}
            children={child}
          />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly to null when kind doesn't match", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <AuthorizeComponent kind="any" authentication={{}} children={child} />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly when ability matches", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <AuthorizeComponent
            entity="user"
            ability="create"
            authentication={authentication}
            children={child}
          />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly to null when ability doesn't match", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <AuthorizeComponent
            entity="user"
            ability="create"
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
