jest.mock('components/global/HigherOrder/fetchData');

import React from 'react';
import { mount } from 'enzyme';
import { SettingsIntegrationsContainer }from '../Integrations';
import { wrapWithRouter } from 'test/helpers/routing';
import { Provider } from 'react-redux';
import build from 'test/fixtures/build';
import entity from 'test/fixtures/entity';

describe("Backend Settings Integrations Container", () => {

  const store = build.store();
  const settings = entity.defaults.settings;

  const component = mount(
    wrapWithRouter(
      <Provider store={store} >
        <SettingsIntegrationsContainer
          settings={settings}
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
