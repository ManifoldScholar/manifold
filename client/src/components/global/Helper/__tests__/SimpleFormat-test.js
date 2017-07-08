import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import SimpleFormat from "../SimpleFormat";

describe("Global.Helper.SimpleFormat component", () => {
  it("renders correctly", () => {
    const component = renderer.create(
      <SimpleFormat text="Basketball is my favorite sport.
        I like the way they dribble up and down the court." />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("removes line breaks", () => {
    const component = shallow(
      <SimpleFormat text="Basketball is my favorite sport.
        I like the way they dribble up and down the court." />
    );
    expect(component.text()).toEqual(
      "Basketball is my favorite sport. I like the way they dribble up and down the court."
    );
  });
});
