jest.mock('velocity-react');
jest.mock('components/global/HigherOrder/fetchData');

import React from 'react';
import renderer from 'react-test-renderer';
import { AnnotatableContainer } from '../Annotatable';
import { Provider } from 'react-redux';
import build from 'test/fixtures/build';
import { wrapWithRouter } from 'test/helpers/routing';

describe("Reader Annotation Annotatable Container", () => {

  const store = build.store();
  const text = build.entity.text("1");
  const section = build.entity.textSection("2");
  const project = build.entity.project("3");
  const props = {
    textId: text.id,
    projectId: project.id,
    sectionId: section.id,
    dispatch: store.dispatch,
    containerSize: 100,
    bodySelector: "main"
  };

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <AnnotatableContainer
          {...props}
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
