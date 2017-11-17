import React from "react";
import renderer from "react-test-renderer";
import { ProjectNewContainer } from "../New";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Backend Project New Container", () => {
  const component = renderer.create(
    wrapWithRouter(
      <Provider store={build.store()}>
        <ProjectNewContainer />
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
