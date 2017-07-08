import React from "react";
import renderer from "react-test-renderer";
import Breadcrumb from "../Breadcrumb";
import { wrapWithRouter } from "test/helpers/routing";

describe("Backend.Navigation.Breadcrumb component", () => {
  const links = [
    {
      path: "/link-1",
      label: "Link One"
    },
    {
      path: "/link-2",
      label: "Link Two"
    }
  ];

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(<Breadcrumb links={links} />)
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
