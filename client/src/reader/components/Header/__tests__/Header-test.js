import React from "react";
import renderer from "react-test-renderer";
import Header from "../";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";
import { FrontendModeContext } from "helpers/contexts";
import { Provider } from "react-redux";

describe("Reader.Header Component", () => {
  const project = build.entity.project("2");
  const text = build.entity.text("1", {}, { project });
  const textWithoutContents = build.entity.text(
    "2",
    { toc: [], metadata: {} },
    { project }
  );

  const store = build.store();

  const appearance = {
    typography: {
      fontSize: {},
      margins: {}
    },
    colors: {}
  };
  const visibility = {
    visibilityFilters: {},
    uiPanels: {}
  };
  const commonActions = {
    toggleSignInUpOverlay: jest.fn(),
    logout: jest.fn(),
    toggleUserPanel: jest.fn(),
    addNotification: jest.fn(),
    removeNotification: jest.fn(),
    clearNotifications: jest.fn()
  };
  const notifications = {
    notifications: []
  };

  const root = wrapWithRouter(
    <Provider store={store}>
      <FrontendModeContext.Provider
        value={{ isLibrary: true, isStandalone: false }}
      >
        <Header
          appearance={appearance}
          visibility={visibility}
          commonActions={commonActions}
          notifications={notifications}
          text={text}
        />
      </FrontendModeContext.Provider>
    </Provider>
  );

  it("renders correctly", () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly when no TOC or metadata", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <FrontendModeContext.Provider
            value={{ isLibrary: true, isStandalone: false }}
          >
            <Header
              appearance={appearance}
              visibility={visibility}
              commonActions={commonActions}
              notifications={notifications}
              text={textWithoutContents}
            />
          </FrontendModeContext.Provider>
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
