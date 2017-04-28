import React from 'react';
import renderer from 'react-test-renderer';
import Button from '../Button';
import build from 'test/fixtures/build';
import entity from 'test/fixtures/entity';
import { Provider } from "react-redux";

describe("Global.Oauth.Button component", () => {

  const store = build.store();
  const settings = entity.defaults.settings;

  it('renders correctly', () => {
    const component = renderer.create(
      <Provider store={store}>
        <Button
          dispatch={store.dispatch}
          provider="twitter"
          settings={settings}
        />
      </Provider>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
