import React from 'react';
import renderer from 'react-test-renderer';
import Resources from '../Resources';
import build from 'test/fixtures/build';
import { wrapWithRouter, renderWithRouter } from 'test/helpers/routing';

describe("Frontend.Project.Resources component", () => {

  const project = build.entity.project("1");
  const resources = [build.entity.resource("2"), build.entity.resource("3")];
  const filterChangeMock = jest.fn();
  const pagintationClickMock = jest.fn();
  const pagination = {
    currentPage: 1,
    perPage: 5,
    totalCount: 10,
    nextPage: 2,
    prevPage: 0,
    totalPages: 2
  };

  it('renders correctly', () => {
    const component = renderer.create(
      wrapWithRouter(
        <Resources
          project={project}
          resources={resources}
          pagination={pagination}
          paginationClickHandler={pagintationClickMock}
          filterChange={filterChangeMock}
          initialFilterState={{}}
        />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
