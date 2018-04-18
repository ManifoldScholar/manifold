import React from "react";
import renderer from "react-test-renderer";
import Placeholder from "../Placeholder";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";

describe("Frontend.ProjectList.Placeholder component", () => {
  const store = build.store();

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
      <Provider store={store}>
        <Placeholder />
      </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
