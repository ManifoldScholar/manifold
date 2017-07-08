import React from "react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import { IngestionNew } from "../New";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";

describe("ProjectDetail Text Ingestion New Container", () => {
  const project = build.entity.project("1");
  const location = {};
  const history = build.history();

  const props = { project, location, history };

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={build.store()}>
        <IngestionNew {...props} />
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
