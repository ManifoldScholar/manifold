import React from 'react';
import { Provider } from 'react-redux';
import Annotation from '../Annotation';
import renderer from 'react-test-renderer';
import build from 'test/fixtures/build';
import { wrapWithRouter, renderWithRouter } from 'test/helpers/routing';

describe("Reader.Annotation.Annotation component", () => {

  const creator = build.entity.user("1");
  const annotation = build.entity.annotation("2");
  const store = build.store();

  const root = (
    wrapWithRouter(
      <Provider store={store} >
        <Annotation
          creator={creator}
          annotation={annotation}
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
