import React from 'react';
import renderer from 'react-test-renderer';
import SocialButtons from '../SocialButtons';
import { Provider } from 'react-redux';
import build from 'test/fixtures/build';
import entity from 'test/fixtures/entity';

describe("Reader.Annotation.Popup.SocialButtons Component", () => {

  const store = build.store();
  const settings = entity.defaults.settings;
  settings.attributes.general.facebookAppId = "1234";

  it('renders correctly', () => {
    const component = renderer.create(
      <Provider store={store} >
        <SocialButtons
          settings={settings}
        />
      </Provider>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
