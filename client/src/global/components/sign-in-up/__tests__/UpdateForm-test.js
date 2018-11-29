import React from "react";
import renderer from "react-test-renderer";
import UpdateForm from "../UpdateForm";
import build from "test/fixtures/build";
import { Provider } from "react-redux";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Global.SignInUp.UpdateForm component", () => {
  const store = build.store();

  const user = build.entity.user("1");

  it("renders correctly when mode is new", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <UpdateForm
            dispatch={store.dispatch}
            authentication={{
              currentUser: user
            }}
            mode="new"
          />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly when mode is existing", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <UpdateForm
            dispatch={store.dispatch}
            authentication={{
              currentUser: user
            }}
            mode="existing"
          />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
