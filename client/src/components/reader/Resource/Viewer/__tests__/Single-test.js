import React from 'react';
import Single from '../Single';
import { mount } from 'enzyme';
import build from 'test/fixtures/build';
import { Provider } from 'react-redux';
import { wrapWithRouter, renderWithRouter } from 'test/helpers/routing';

describe("Reader.Resource.Viewer.Single component", () => {

  const resource = build.entity.resource("1");
  const store = build.store();

  const root = (
    <Provider store={store} >
      <Single
        resource={resource}
      />
    </Provider>
  );

  it('renders correctly', () => {
    const component = mount(root);
    let tree = component.debug();
    expect(tree).toMatchSnapshot();
  });

});
