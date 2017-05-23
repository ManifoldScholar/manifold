jest.mock('components/global/HigherOrder/fetchData');
jest.mock('api/client');

import React from 'react';
import renderer from 'react-test-renderer';
import { ProjectDetailCategoryEditContainer } from '../Edit';
import { wrapWithRouter } from 'test/helpers/routing';
import { Provider } from 'react-redux';
import build from 'test/fixtures/build';

describe("Backend ProjectDetail Category Edit Container", () => {

  const store = build.store();
  const project = build.entity.project("1");
  const category = build.entity.category("2");
  category.relationships.project = project;

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store} >
        <ProjectDetailCategoryEditContainer
          category={category}
          dispatch={store.dispatch}
          match={{
            params: {}
          }}
          refresh={jest.fn()}
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
