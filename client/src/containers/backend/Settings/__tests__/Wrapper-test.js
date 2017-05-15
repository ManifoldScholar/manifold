jest.mock('components/global/HigherOrder/fetchData');

import React from 'react';
import renderer from 'react-test-renderer';
import { SettingsWrapperContainer } from '../Wrapper';
import { wrapWithRouter } from 'test/helpers/routing';
import { Provider } from 'react-redux';
import build from 'test/fixtures/build';

describe("Backend Settings Wrapper Container", () => {

  const store = build.store();

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store} >
        <SettingsWrapperContainer
          route={{
            routes: []
          }}
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
