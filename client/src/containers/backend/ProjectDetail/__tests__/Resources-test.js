jest.mock('components/global/HigherOrder/fetchData');

import React from 'react';
import renderer from 'react-test-renderer';
import { ProjectDetailResources } from '../Resources';
import { wrapWithRouter } from 'test/helpers/routing';
import { Provider } from 'react-redux';
import build from 'test/fixtures/build';

describe("Backend ProjectDetail Resources Container", () => {

  const store = build.store();
  const project = build.entity.project("1");
  const resources = [build.entity.resource("2"), build.entity.resource("3")];
  project.relationships.resources = resources;

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store} >
        <ProjectDetailResources
          project={project}
          resources={resources}
          resourcesMeta={{
            pagination: build.pagination()
          }}
          dispatch={store.dispatch}
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
