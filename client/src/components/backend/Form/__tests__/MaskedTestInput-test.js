jest.mock("react-text-mask", () => () => "ReactTextMask");

import React from "react";
import MaskedTextInput from "../MaskedTextInput";
import Adapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

describe("Backend.Form.MaskedTextInput component", () => {
  const changeMock = jest.fn();

  it("renders correctly", () => {
    const component = Enzyme.mount(
      <MaskedTextInput
        mask={[/\d/, /\d/, /\d/, /\d/]}
        placeholder="Hold my place"
        onChange={changeMock}
        label="Label this"
        value="attributes[fake]"
      />
    );

    // MaskedTextInput uses MaskedInput from react-text-mask.
    // Mounting with Enzyme to avoid mocking that component.
    // debug() outputs the markdown generated.
    let tree = component.html();
    expect(tree).toMatchSnapshot();
  });
});
