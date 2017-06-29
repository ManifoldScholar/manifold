import React from 'react';
import renderer from 'react-test-renderer';
import ProjectDetailCategoryNew from '../New';
import { wrapWithRouter } from 'test/helpers/routing';
import { Provider } from 'react-redux';
import build from 'test/fixtures/build';

describe("Backend ProjectDetail Category New Container", () => {

  const store = build.store();
  const project = build.entity.project("1");

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store} >
        <ProjectDetailCategoryNew
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
