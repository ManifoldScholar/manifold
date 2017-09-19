import React from "react";
import renderer from "react-test-renderer";
import MetaList from "../MetaList";

describe("Global.MetaList component", () => {
  const metadata = {
    title: "Southernplayalisticadillacmuzik",
    releaseDate: "April 26, 1994"
  };

  it("renders correctly", () => {
    const component = renderer.create(<MetaList metadata={metadata} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
