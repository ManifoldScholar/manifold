import React from "react";
import Truncated from "../Truncated";
import Adapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme";
Enzyme.configure({ adapter: new Adapter() });

describe("Reader.Annotation.Selection.Truncated Component", () => {
  it("renders correctly", () => {
    const component = Enzyme.mount(
      <Truncated
        truncate={40}
        selection="You will remember we from now til forever, G. I am infinity, lyrics flowing endlessly."
      />
    );
    let tree = component.debug();
    expect(tree).toMatchSnapshot();
  });
});
