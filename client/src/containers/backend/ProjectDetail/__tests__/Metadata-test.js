jest.mock('components/global/HigherOrder/fetchData');

import React from 'react';
import renderer from 'react-test-renderer';
import ProjectDetailMetadata from '../Metadata';
import { wrapWithRouter } from 'test/helpers/routing';
import { Provider } from 'react-redux';
import build from 'test/fixtures/build';

describe("Backend ProjectDetail Metadata Container", () => {

  const store = build.store();
  const project = build.entity.project("1");

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store} >
        <ProjectDetailMetadata
          project={project}
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
