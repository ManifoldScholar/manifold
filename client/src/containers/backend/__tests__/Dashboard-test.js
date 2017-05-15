jest.mock('components/global/HigherOrder/fetchData');

import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import { DashboardContainer } from '../Dashboard';
import build from 'test/fixtures/build';
import { wrapWithRouter } from 'test/helpers/routing';

describe("Backend Dashboard Container", () => {

  const projects = [build.entity.project("1"), build.entity.project("2")];
  const projectsMeta = {
    pagination: build.pagination()
  };

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={build.store()}>
        <DashboardContainer
          projects={projects}
          projectsMeta={projectsMeta}
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
