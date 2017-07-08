import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import PressLogo from "../PressLogo";

describe("Global.PressLogo component", () => {
  it("renders correctly", () => {
    const component = renderer.create(<PressLogo url="some/url" />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders a placeholder when no url specified", () => {
    const component = shallow(<PressLogo />);
    expect(component.find("i")).toHaveLength(1);
  });
});
