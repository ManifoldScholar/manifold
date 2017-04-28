import React from 'react';
import Pagination from '../Pagination';
import renderer from 'react-test-renderer';
import { wrapWithRouter, renderWithRouter } from 'test/helpers/routing';

describe("Reader.Section.Pagination component", () => {

  const root = (
    wrapWithRouter(
      <Pagination
        textId={"1"}
        sectionId={"2"}
        spine={["1234", "5678", "0000"]}
      />
    )
  );

  it('renders correctly', () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
