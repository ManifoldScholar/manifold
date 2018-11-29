import React from "react";
import renderer from "react-test-renderer";
import LockBodyScroll from "../LockBodyScroll";

describe("Global.Utility.LockBodyScroll component", () => {
  const children = <div>How is babby formed?</div>;

  it("renders correctly", () => {
    const component = renderer.create(<LockBodyScroll children={children} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
