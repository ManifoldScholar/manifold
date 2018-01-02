import React from "react";
import Wrapper from "../Wrapper";
import { mount } from "enzyme";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Backend.Drawer.Wrapper Component", () => {
  it("renders correctly", () => {
    const component = mount(
      wrapWithRouter(
        <Wrapper
          open={true}
          style="backend"
          title="wrapper"
          closeCallback={jest.fn()}
        />
      )
    );

    // Wrapper has event listeners attached to document,
    // so we need to use Enzyme to mock that.
    // debug() outputs the markdown generated.
    let tree = component.debug();
    expect(tree).toMatchSnapshot();
  });
});
