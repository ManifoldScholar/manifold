import React from "react";
import renderer from "react-test-renderer";
import Meta from "../Meta";
import build from "test/fixtures/build";
import { Provider } from "react-redux";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Frontend.Resource.Meta component", () => {
  const resource = build.entity.resource(
    "1",
    {},
    { project: build.entity.project("1") }
  );
  const store = build.store();

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <Meta resource={resource} showIcon showTags />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
