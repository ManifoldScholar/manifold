import React from "react";
import Body from "../Body";
import renderer from "react-test-renderer";
import { mount } from "enzyme";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import BackLink from "frontend/components/back-link";
import { FrontendModeContext } from "helpers/contexts";

describe("Reader.ReturnMenu.Body component", () => {
  const project = build.entity.project("1");
  const toggleMock = jest.fn();
  const store = build.store();

  const root = wrapWithRouter(
    <Provider store={store}>
      <BackLink.Provider>
        <FrontendModeContext.Provider
          value={{ isLibrary: true, isStandalone: false }}
        >
          <Body
            returnUrl="/some/back/url"
            projectTitle={project.attributes.title}
            toggleSignInUpOverlay={toggleMock}
          />
        </FrontendModeContext.Provider>
      </BackLink.Provider>
    </Provider>
  );

  it("renders correctly", () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("should trigger toggleSignInOverlay callback when toggle is clicked", () => {
    const wrapper = mount(root);
    toggleMock.mockClear();
    wrapper.find('[data-id="toggle-overlay"]').simulate("click");
    expect(toggleMock).toHaveBeenCalled();
  });
});
