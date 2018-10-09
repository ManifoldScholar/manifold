import React from "react";
import renderer from "react-test-renderer";
import Filters from "../Filters";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Frontend.ProjectCollection.Filters component", () => {

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Filters
          filterChangeHandler={jest.fn}
        />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
