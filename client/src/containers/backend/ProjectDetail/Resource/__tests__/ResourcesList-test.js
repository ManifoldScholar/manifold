import React from 'react';
import renderer from 'react-test-renderer';
import { ProjectDetailResourcesList } from '../ResourcesList';
import { wrapWithRouter } from 'test/helpers/routing';
import { Provider } from 'react-redux';
import build from 'test/fixtures/build';

describe("Backend ProjectDetail Resource ResourcesList Container", () => {

  const store = build.store();
  const project = build.entity.project("1");
  const resources = [build.entity.resource("2"), build.entity.resource("3")];

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store} >
        <ProjectDetailResourcesList
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
