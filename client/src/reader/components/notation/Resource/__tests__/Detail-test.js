import React from "react";
import { mount } from "enzyme";
import Detail from "../Detail";
import renderer from "react-test-renderer";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Reader.Notation.Resource.Detail component", () => {
  const resource = build.entity.resource("1");
  resource.relationships.project = build.entity.project("2");
  const closeMock = jest.fn();

  const component = renderer.create(
    wrapWithRouter(<Detail resource={resource} handleClose={closeMock} />)
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
