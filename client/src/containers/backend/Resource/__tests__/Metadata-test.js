import React from "react";
import renderer from "react-test-renderer";
import ResourceMetadataContainer from "../Metadata";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Backend Resource Metadata Container", () => {
  const store = build.store();
  const resource = build.entity.resource("1");

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <ResourceMetadataContainer resource={resource} />
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
