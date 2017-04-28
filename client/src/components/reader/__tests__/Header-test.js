import React from 'react';
import renderer from 'react-test-renderer';
import Header from '../Header';
import build from 'test/fixtures/build';
import { wrapWithRouter, renderWithRouter } from 'test/helpers/routing';
import { Provider } from 'react-redux';

describe("Reader.Header Component", () => {

  const text = build.entity.text("1");
  const project = build.entity.project("2");
  text.relationships.project = project;

  const store = build.store();

  const appearance = {
      typography: {
        fontSize: {}
      },
      colors: {}
  };
  const visibility = {
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

  const root = (
    wrapWithRouter(
      <Provider store={store} >
        <Header
          appearance={appearance}
          visibility={visibility}
          commonActions={commonActions}
          notifications={notifications}
          text={text}
        />
      </Provider>
    )
  );

  it('renders correctly', () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
