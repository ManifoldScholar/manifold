import React from "react";
import renderer from "react-test-renderer";
import Secondary from "../Secondary";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Backend.Navigation.Secondary component", () => {
  const links = [
    {
      route: "backendProjects",
      label: "projects",
    },
    {
      route: "backendRecords",
      label: "records",
    }
  ];

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(<Secondary links={links} />)
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
