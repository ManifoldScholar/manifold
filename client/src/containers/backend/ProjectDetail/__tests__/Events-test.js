jest.mock('components/global/HigherOrder/fetchData');

import React from 'react';
import renderer from 'react-test-renderer';
import { ProjectDetailEvents } from '../Events';
import { wrapWithRouter } from 'test/helpers/routing';
import { Provider } from 'react-redux';
import build from 'test/fixtures/build';

describe("Backend ProjectDetail Events Container", () => {

  const store = build.store();
  const project = build.entity.project("1");
  const events = [build.entity.event("2"), build.entity.event("3")];
  project.relationships.events = events;

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store} >
        <ProjectDetailEvents
          project={project}
          dispatch={store.dispatch}
          events={events}
          eventsMeta={{
            pagination: build.pagination()
          }}
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
