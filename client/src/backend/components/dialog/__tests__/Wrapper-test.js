import React from "react";
import { mount } from "enzyme";
import Wrapper from "../Wrapper";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Backend.Dialog.Wrapper Component", () => {
  const child = <div>How is babby formed?</div>;

  it("renders correctly", () => {
    const component = mount(
      wrapWithRouter(
        <Wrapper className="dialog-confirm" maxWidth={400} children={child} />
      )
    );

    // Wrapper has event listeners attached to document,
    // so we need to use Enzyme to mock that.
    // debug() outputs the markdown generated.
    let tree = component.debug();
    expect(tree).toMatchSnapshot();
  });
});
