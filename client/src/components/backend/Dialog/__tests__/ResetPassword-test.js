import React from "react";
import ResetPassword from "../ResetPassword";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";
import Adapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

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
    const component = Enzyme.mount(
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
