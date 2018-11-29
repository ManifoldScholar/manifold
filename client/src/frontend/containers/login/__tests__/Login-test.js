import React from "react";
import renderer from "react-test-renderer";
import { LoginContainer } from "../";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";

describe("Frontend Login Container", () => {
  const store = build.store();
  const user = build.entity.user("1");
  user.email = "rowan@woof.dog";
  const authentication = {
    authenticated: true,
    currentUser: user
  };

  it("renders correctly when logged in", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <LoginContainer
            authentication={authentication}
            dispatch={store.dispatch}
          />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly when logged out", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <LoginContainer
            authentication={{
              authenticated: false
            }}
            dispatch={store.dispatch}
          />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
