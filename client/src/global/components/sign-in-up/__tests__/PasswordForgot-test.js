import React from "react";
import renderer from "react-test-renderer";
import PasswordForgot from "../PasswordForgot";
import build from "test/fixtures/build";
import { Provider } from "react-redux";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";
import Adapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

describe("Global.SignInUp.PasswordForgot component", () => {
  const store = build.store();

  const handleViewChange = jest.fn();

  const root = wrapWithRouter(
    <Provider store={store}>
      <PasswordForgot
        dispatch={store.dispatch}
        handleViewChange={handleViewChange}
      />
    </Provider>
  );

  it("renders correctly", () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("should trigger handleViewChange callback when show login is clicked", () => {
    const wrapper = Enzyme.mount(root);
    handleViewChange.mockClear();
    wrapper
      .find('[data-id="show-login"]')
      .first()
      .simulate("click");
    expect(handleViewChange).toHaveBeenCalled();
  });

  it("should trigger handleViewChange callback when show create is clicked", () => {
    const wrapper = Enzyme.mount(root);
    handleViewChange.mockClear();
    wrapper
      .find('[data-id="show-create"]')
      .first()
      .simulate("click");
    expect(handleViewChange).toHaveBeenCalled();
  });
});
