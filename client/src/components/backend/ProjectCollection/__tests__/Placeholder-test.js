import React from "react";
import renderer from "react-test-renderer";
import Placeholder from "../Placeholder";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Backend.ProjectCollection.Placeholder component", () => {

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Placeholder createClickHandler={jest.fn}/>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
