import React from "react";
import renderer from "react-test-renderer";
import { mount } from "enzyme";
import Login from "../Login";
import build from "test/fixtures/build";
import { Provider } from "react-redux";

describe("Global.SignInUp.Login component", () => {
  const store = build.store();

  const handleViewChange = jest.fn();
  const user = build.entity.user("1");

  const root = (
    <Provider store={store}>
      <Login
        dispatch={store.dispatch}
        handleViewChange={handleViewChange}
        user={user}
        authentication={{
          currentUser: user
        }}
      />
    </Provider>
  );

  it("renders correctly", () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("should trigger handleViewChange callback when show forgot is clicked", () => {
    const wrapper = mount(root);
    handleViewChange.mockClear();
    wrapper.find('[data-id="show-forgot"]').first().simulate("click");
    expect(handleViewChange).toHaveBeenCalled();
  });

  it("should trigger handleViewChange callback when show create is clicked", () => {
    const wrapper = mount(root);
    handleViewChange.mockClear();
    wrapper.find('[data-id="show-create"]').first().simulate("click");
    expect(handleViewChange).toHaveBeenCalled();
  });
});
