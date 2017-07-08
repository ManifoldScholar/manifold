import React from "react";
import renderer from "react-test-renderer";
import { mount } from "enzyme";
import PasswordForgot from "../PasswordForgot";
import build from "test/fixtures/build";
import { Provider } from "react-redux";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Global.SignInUp.PasswordForgot component", () => {
  const store = build.store();

  const showCreate = jest.fn();
  const showLogin = jest.fn();

  const root = wrapWithRouter(
    <Provider store={store}>
      <PasswordForgot
        dispatch={store.dispatch}
        showCreate={showCreate}
        showLogin={showLogin}
      />
    </Provider>
  );

  it("renders correctly", () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("should trigger showLogin callback when show login is clicked", () => {
    const wrapper = mount(root);
    showLogin.mockClear();
    wrapper.find('[data-id="show-login"]').first().simulate("click");
    expect(showLogin).toHaveBeenCalled();
  });

  it("should trigger showCreate callback when show create is clicked", () => {
    const wrapper = mount(root);
    showCreate.mockClear();
    wrapper.find('[data-id="show-create"]').first().simulate("click");
    expect(showCreate).toHaveBeenCalled();
  });
});
