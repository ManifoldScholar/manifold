import React from 'react';
import Searchable from '../Searchable';
import { shallow, render, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { Event } from '/components/backend';

describe("List.Searchable component", () => {

  const entities = [
    {
      id: 1,
      attributes: {
        eventType: 'PROJECT_CREATED',
        eventTitle: "Bicycle Race",
        excerpt: "I want to ride my bicycle"
      }
    },
    {
      id: 2,
      attributes: {
        eventType: 'TWEET',
        eventTitle: "We Will Rock You",
        excerpt: "Buddy, you're a boy, make a big noise."
      }
    }
  ];
  const pagination = {
    perPage: 1,
    currentPage: 1,
    totalPages: 10,
    totalCount: 2,
    nextPage: 2,
    prevPage: 0
  };
  const pageChangeMock = jest.fn();
  const filterChangeMock = jest.fn();
  const eventDestroyMock = jest.fn();
  const fakeClick = {stopPropagation: () => undefined, preventDefault: () => undefined};
  const root = (
    <Searchable
      entities={entities}
      singularUnit="event"
      pluralUnit="events"
      pagination={pagination}
      paginationClickHandler={() => pageChangeMock}
      entityComponent={Event.ListItem}
      filterChangeHandler={filterChangeMock}
      destroyHandler={eventDestroyMock}
      filterOptions={{
        type: ['TWEET', 'PROJECT_CREATED']
      }}
    />
  );

  it('renders correctly', () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the correct number of ListItems', () => {
    const wrapper = mount(root);
    expect(wrapper.find(wrapper.props().entityComponent)).toHaveLength(2);
  });

  it('should show filter options when toggle is clicked', () => {
    const wrapper = shallow(root);
    expect(wrapper.find('[data-id="filter"]')).toHaveLength(0);
    wrapper.find('[data-id="filter-toggle"]').simulate('click', fakeClick);
    expect(wrapper.find('[data-id="filter"]')).toHaveLength(1);
  });

  it('should trigger filterChangeMock callback when filter is changed', () => {
    const wrapper = shallow(root);
    const filterEvent = {
      preventDefault: () => true,
      target: {
        value: "TWEET"
      }
    };
    wrapper.setState({ showOptions: true });
    wrapper.find('[data-id="filter"]').simulate('change', filterEvent);
    expect(filterChangeMock).toHaveBeenCalled();
  });

  it('should trigger eventDestroyMock callback when destroy is clicked', () => {
    const wrapper = mount(root);
    eventDestroyMock.mockClear();
    wrapper.find('[data-id="destroy"]').first().simulate('click', fakeClick);
    expect(eventDestroyMock).toHaveBeenCalled();
  });

  it('should trigger paginationClickHandler callback when page change is clicked', () => {
    const wrapper = mount(root);
    pageChangeMock.mockClear();
    wrapper.find('[data-id="page-next"]').simulate('click', fakeClick);
    expect(pageChangeMock).toHaveBeenCalled();
  });

});
