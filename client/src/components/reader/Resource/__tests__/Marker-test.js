import React from 'react';
import Marker from '../Marker';
import renderer from 'react-test-renderer';
import build from 'test/fixtures/build';
import { wrapWithRouter, renderWithRouter } from 'test/helpers/routing';
import { Provider } from 'react-redux';

describe("Reader.Resource.Marker component", () => {

  const annotation = build.entity.annotation("1");
  const store = build.store();

  const root = (
    wrapWithRouter(
      <Provider store={store} >
        <Marker
          annotations={[annotation]}
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
