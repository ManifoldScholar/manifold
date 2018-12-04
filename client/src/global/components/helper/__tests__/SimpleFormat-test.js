import React from "react";
import renderer from "react-test-renderer";
import SimpleFormat from "../SimpleFormat";
import Adapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

describe("Global.Helper.SimpleFormat component", () => {
  it("renders correctly", () => {
    const component = renderer.create(
      <SimpleFormat
        text="Basketball is my favorite sport.
        I like the way they dribble up and down the court."
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
