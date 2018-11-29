import React from "react";
import renderer from "react-test-renderer";
import DetailHeader from "../DetailHeader";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Backend.Navigation.DetailHeader component", () => {
  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <DetailHeader
          title="Rowan"
          subtitle="World's Greatest Dog"
          type="project"
          breadcrumb={[
            {
              label: "All Projects",
              path: "/backend"
            }
          ]}
        />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
