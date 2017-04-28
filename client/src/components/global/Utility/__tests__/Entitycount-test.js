import React from 'react';
import renderer from 'react-test-renderer';
import EntityCount from '../EntityCount';

describe("Global.Utility.EntityCount component", () => {

  const props = {
    pagination: {
      currentPage: 1,
      perPage: 5,
      totalCount: 10
    },
    singularUnit: 'entity',
    pluralUnit: 'entities'
  };

  it('renders correctly', () => {
    const component = renderer.create(
      <EntityCount
        {...props}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
