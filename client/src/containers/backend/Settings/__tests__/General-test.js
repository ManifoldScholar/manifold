jest.mock('components/global/HigherOrder/fetchData');

import React from 'react';
import renderer from 'react-test-renderer';
import { SettingsGeneralContainer }from '../General';
import { wrapWithRouter } from 'test/helpers/routing';
import { Provider } from 'react-redux';
import build from 'test/fixtures/build';
import entity from 'test/fixtures/entity';

describe("Backend Settings General Container", () => {

  const store = build.store();
  const settings = entity.defaults.settings;

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store} >
        <SettingsGeneralContainer
          settings={settings}
        />
      </Provider>
    )
  );

  it("renders correctly", () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render to null", () => {
    let tree = component.toJSON();
    expect(tree).not.toBe(null);
  });

});
