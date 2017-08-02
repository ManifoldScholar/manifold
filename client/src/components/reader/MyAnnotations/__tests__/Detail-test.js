import React from "react";
import renderer from "react-test-renderer";
import Detail from "../Detail";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";

describe("Reader MyAnnotations Detail Component", () => {
  const store = build.store();
  const text = build.entity.text("1");
  const annotation = build.entity.annotation("1");
  const props = {
    text,
    annotation,
    dispatch: store.dispatch
  };

  const component = renderer.create(wrapWithRouter(<Detail {...props} />));

  it("renders correctly", () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render to null", () => {
    let tree = component.toJSON();
    expect(tree).not.toBe(null);
  });
});
