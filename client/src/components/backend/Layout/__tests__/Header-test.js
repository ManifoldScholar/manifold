import React from 'react';
import renderer from 'react-test-renderer';
import Header from '../Header';
import build from 'test/fixtures/build';
import { wrapWithRouter, renderWithRouter } from 'test/helpers/routing';

describe("Backend.Layout.Header component", () => {

  const settings = build.entity.settings();
  const toggleOverlayMock = jest.fn();
  const togglerUserPanelMock = jest.fn();
  const startLogoutMock = jest.fn();


  it('renders correctly', () => {
    const component = renderer.create(
      wrapWithRouter(
        <Header
          authentication={{ authenticated: false }}
          notifications={{ notifications: {} }}
          location={{}}
          visibility={{ uiPanels: {} }}
          settings={settings}
          commonActions={{
            toggleSignInUpOverlay: toggleOverlayMock,
            toggleUserPanel: togglerUserPanelMock,
            logout: startLogoutMock
          }}
        />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
