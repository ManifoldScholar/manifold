import React from "react";
import renderer from "react-test-renderer";
import Placeholder from "../Placeholder";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";

describe("Frontend.ProjectCollection.Placeholder component", () => {
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
