import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import Pagination from '../Pagination';

describe("Global.Utility.Pagination component", () => {

  const pageChangeMock = jest.fn();
  const fakeClick = {stopPropagation: () => undefined, preventDefault: () => undefined};
  const root = (
    <Pagination
      pagination={
        {
          currentPage: 1,
          perPage: 5,
          totalCount: 10,
          nextPage: 2,
          prevPage: 0,
          totalPages: 2
        }
      }
      paginationClickHandler={() => pageChangeMock}
    />
  );

  it('renders correctly', () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders null without pagination props', () => {
    const component = renderer.create(
      <Pagination
        paginationClickHandler={() => pageChangeMock}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should trigger paginationClickHandler callback when pagination target is clicked', () => {
    const wrapper = mount(root);
    pageChangeMock.mockClear();
    wrapper.find('[href="#pagination-target"]').first().simulate('click', fakeClick);
    expect(pageChangeMock).toHaveBeenCalled();
  });
});
