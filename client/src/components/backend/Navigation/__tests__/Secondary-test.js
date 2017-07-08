import React from "react";
import renderer from "react-test-renderer";
import Secondary from "../Secondary";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Backend.Navigation.Secondary component", () => {
  const links = [
    {
      path: "/link-1",
      label: "Link One",
      key: "one"
    },
    {
      path: "/link-2",
      label: "Link Two",
      key: "two"
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
