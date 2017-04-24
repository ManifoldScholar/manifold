import React from 'react';
import renderer from 'react-test-renderer';
import { ProjectResources } from 'containers/frontend';
import { Provider } from 'react-redux';
import build from 'test/fixtures/build';

describe("ProjectResourcesContainer", () => {

  const pagination = build.pagination();
  const store = build.store();

  const project = build.entity.project("1");
  const resource = build.entity.resource("2");

  const pageChangeMock = jest.fn();
  const filterChangeMock = jest.fn();

  const props = {
    project,
    resources: [resource],
    meta: { pagination },
    paginationClickHandler: () => pageChangeMock,
    filterChange: filterChangeMock,
    initialFilterState: null,
    location: { query: null }
  };

  const component = renderer.create(
    <Provider store={store}>
      <ProjectResources
        {...props}
      />
    </Provider>
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




