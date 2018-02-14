import React from "react";
import renderer from "react-test-renderer";
import { mount } from "enzyme";
import Create from "../Create";
import build from "test/fixtures/build";
import { Provider } from "react-redux";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Global.SignInUp.Create component", () => {
  const store = build.store();

  const handleViewChange = jest.fn();
  const user = build.entity.user("1");

  const root = wrapWithRouter(
    <Provider store={store}>
      <Create
        dispatch={store.dispatch}
        handleViewChange={handleViewChange}
        user={user}
      />
    </Provider>
  );

  it("renders correctly", () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("should trigger handleViewChange callback when show login is clicked", () => {
    const wrapper = mount(wrapWithRouter(root));
    handleViewChange.mockClear();
    wrapper
      .find('[data-id="show-login"]')
      .first()
      .simulate("click");
    expect(handleViewChange).toHaveBeenCalled();
  });
});
