import React from "react";
import renderer from "react-test-renderer";
import Header from "../Header";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";

describe("Frontend.Layout.Header component", () => {
  const settings = build.entity.settings();
  const store = build.store();
  const toggleOverlayMock = jest.fn();
  const togglerUserPanelMock = jest.fn();
  const startLogoutMock = jest.fn();

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <Header
            authentication={{ authenticated: false }}
            notifications={{ notifications: {} }}
            commonActions={{
              toggleSignInUpOverlay: toggleOverlayMock,
              toggleUserPanel: togglerUserPanelMock,
              logout: startLogoutMock
            }}
            visibility={{ uiPanels: {} }}
            location={{ pathname: "" }}
            settings={settings}
          />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
