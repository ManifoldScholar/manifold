import React from "react";
import renderer from "react-test-renderer";
import CreateUpdate from "../CreateUpdate";
import build from "test/fixtures/build";
import { Provider } from "react-redux";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Global.SignInUp.CreateUpdate component", () => {
  const store = build.store();

  const user = build.entity.user("1");

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <CreateUpdate
            authentication={{
              currentUser: user
            }}
          />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
