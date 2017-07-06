import React from 'react';
import renderer from 'react-test-renderer';
import { SettingsThemeContainer } from '../Theme';
import { wrapWithRouter } from 'test/helpers/routing';
import { Provider } from 'react-redux';
import build from 'test/fixtures/build';
import entity from 'test/fixtures/entity';

describe("Backend Settings Theme Container", () => {

  const store = build.store();
  const settings = entity.defaults.settings;

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store} >
        <SettingsThemeContainer
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
