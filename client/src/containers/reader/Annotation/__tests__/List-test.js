import React from 'react';
import renderer from 'react-test-renderer';
import { AnnotationList } from '../List';
import { Provider } from 'react-redux';
import build from 'test/fixtures/build';
import { wrapWithRouter } from 'test/helpers/routing';

describe("Reader Annotation List Container", () => {

  const store = build.store();
  const annotationA = build.entity.annotation("1");
  const annotationB = build.entity.annotation("2");
  annotationA.relationships.creator = build.entity.user("3");
  annotationB.relationships.creator = build.entity.user("4");
  const annotations = [annotationA, annotationB];
  const annotationIds = ["1", "2"];
  const props = {
    annotations,
    annotationIds,
    createHandler: jest.fn(),
    dispatch: store.dispatch
  };

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <AnnotationList
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
