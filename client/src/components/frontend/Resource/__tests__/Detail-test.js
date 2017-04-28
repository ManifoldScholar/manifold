jest.mock('components/global/HigherOrder/fetchData');
jest.mock('api/client');

import React from 'react';
import renderer from 'react-test-renderer';
import Detail from '../Detail';
import build from 'test/fixtures/build';
import { Provider } from 'react-redux';
import { wrapWithRouter, renderWithRouter } from 'test/helpers/routing';

describe("Frontend.Resource.Detail component", () => {

  const store = build.store();

  const resource = build.entity.resource("1");
  const project = build.entity.project("2");

  it('renders correctly', () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store} >
          <Detail
            resource={resource}
            projectId={project.id}
            resourceUrl="resource/url"
            projectUrl="project/url"
          />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
