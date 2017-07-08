import React from "react";
import { mount } from "enzyme";
import ResetPassword from "../ResetPassword";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Backend.Dialog.ResetPassword Component", () => {
  const resolveMock = jest.fn();
  const rejectMock = jest.fn();
  const uiProps = {
    heading: "Reset Password",
    message: "Pick a style, dawg.",
    reject: rejectMock,
    resolve: resolveMock
  };

  it("renders correctly", () => {
    const component = mount(
      wrapWithRouter(
        <Provider store={build.store()}>
          <ResetPassword uiProps={uiProps} />
        </Provider>
      )
    );

    // Confirm has event listeners attached to document,
    // so we need to use Enzyme to mock that.
    // debug() outputs the markdown generated.
    let tree = component.debug();
    expect(tree).toMatchSnapshot();
  });
});
