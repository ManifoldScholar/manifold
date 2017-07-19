import React from "react";
import renderer from "react-test-renderer";
import Type from "../Type";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Backend.Ingestion.Form.Type component", () => {
  const modelValueMock = jest.fn();
  const location = {};
  const history = build.history();
  const triggerClose = jest.fn();

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Type
          getModelValue={modelValueMock}
          location={location}
          history={history}
        />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders cancel button when passed triggerClose prop", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Type
          getModelValue={modelValueMock}
          location={location}
          history={history}
          triggerClose={triggerClose}
        />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
