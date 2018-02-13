import React from "react";
import renderer from "react-test-renderer";
import Overlay from "../Overlay";
import build from "test/fixtures/build";
import { Provider } from "react-redux";
import Adapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

describe("Global.SignInUp.Overlay component", () => {
  const store = build.store();
  const fakeDomEvent = {
    stopPropagation: () => undefined,
    preventDefault: () => undefined
  };

  const hideOverlayMock = jest.fn();
  const user = build.entity.user("1");

  const root = (
    <Provider store={store}>
      <Overlay
        dispatch={store.dispatch}
        visible
        hideSignInUpOverlay={hideOverlayMock}
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

  it("should trigger hideSignInUpOverlay callback when close overlay is clicked", () => {
    const wrapper = Enzyme.mount(root);
    hideOverlayMock.mockClear();
    wrapper
      .find('[data-id="overlay-close"]')
      .first()
      .simulate("click", fakeDomEvent);
    expect(hideOverlayMock).toHaveBeenCalled();
  });
});
