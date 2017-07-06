import React from 'react';
import { mount } from 'enzyme';
import TextDetailMetadata from '../Metadata';
import { wrapWithRouter } from 'test/helpers/routing';
import { Provider } from 'react-redux';
import build from 'test/fixtures/build';

describe("Backend TextDetail Metadata Container", () => {

  const store = build.store();
  const text = build.entity.text("1");
  text.relationships.creators = [build.entity.user("2")];
  text.relationships.contributors = [build.entity.user("3")];

  const component = mount(
    wrapWithRouter(
      <Provider store={store} >
        <TextDetailMetadata
          text={text}
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
