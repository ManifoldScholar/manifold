import React from "react";
import renderer from "react-test-renderer";
import Avatar from "../";
import Adapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

describe("Global.Avatar component", () => {
  it("renders correctly", () => {
    const component = renderer.create(<Avatar url="some/url" />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders a placeholder when no url specified", () => {
    const component = Enzyme.shallow(<Avatar />);
    expect(component.find("i")).toHaveLength(1);
  });
});
