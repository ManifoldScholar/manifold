import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { BackendContainer } from '../Backend';
import build from 'test/fixtures/build';
import { wrapWithRouter } from 'test/helpers/routing';

describe("Backend Backend Container", () => {

  const history = build.history();
  const notifications = {
    notifications: {}
  };
  const authentication = {
    authenticated: true,
    currentUser: build.entity.user("1")
  };
  const route = {
    routes: []
  };
  const visibility = {
    uiPanels: {}
  };

  const component = mount(
    wrapWithRouter(
      <Provider store={build.store()}>
        <BackendContainer
          history={history}
          notifications={notifications}
          authentication={authentication}
          route={route}
          visibility={visibility}
        />
      </Provider>
    )
  );

  it("renders correctly", () => {
    let tree = component.debug();
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render to null", () => {
    let tree = component.debug();
    expect(tree).not.toBe(null);
  });

});
