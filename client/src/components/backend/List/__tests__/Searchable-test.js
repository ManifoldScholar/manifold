import React from "react";
import Searchable from "../Searchable";
import { shallow, render, mount } from "enzyme";
import renderer from "react-test-renderer";
import ListItem from "components/backend/Resource/ListItem";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Backend.List.Searchable component", () => {
  const entities = [build.entity.resource("1"), build.entity.resource("2")];
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
  const fakeClick = {
    stopPropagation: () => undefined,
    preventDefault: () => undefined
  };
  const root = wrapWithRouter(
    <Searchable
      entities={entities}
      singularUnit="resource"
      pluralUnit="resources"
      pagination={pagination}
      paginationClickHandler={() => pageChangeMock}
      entityComponent={ListItem}
      filterChangeHandler={filterChangeMock}
      filterOptions={{
        type: ["TWEET", "PROJECT_CREATED"]
      }}
    />
  );

  function buildComponent(props) {
    return (
      <div>
        Can we build {props.entity.attributes.title}?
        <p>Yes, we can.</p>
      </div>
    );
  }

  it("renders correctly", () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly when passed a component builder function", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Searchable
          entities={entities}
          singularUnit="resource"
          pluralUnit="resources"
          pagination={pagination}
          paginationClickHandler={() => pageChangeMock}
          entityComponent={buildComponent}
          filterChangeHandler={filterChangeMock}
          filterOptions={{
            type: ["TWEET", "PROJECT_CREATED"]
          }}
        />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("should render the correct number of ListItems", () => {
    const wrapper = mount(root);
    expect(wrapper.find(ListItem)).toHaveLength(2);
  });

  it("should show filter options when toggle is clicked", () => {
    const wrapper = mount(root);
    expect(wrapper.find('[data-id="filter"]')).toHaveLength(0);
    wrapper.find('[data-id="filter-toggle"]').simulate("click", fakeClick);
    expect(wrapper.find('[data-id="filter"]')).toHaveLength(1);
  });

  it("should trigger filterChangeMock callback when filter is changed", () => {
    const wrapper = mount(root);
    const filterEvent = {
      preventDefault: () => true,
      target: {
        value: "TWEET"
      }
    };
    wrapper.find('[data-id="filter-toggle"]').simulate("click", fakeClick);
    wrapper.find('[data-id="filter"]').simulate("change", filterEvent);
    expect(filterChangeMock).toHaveBeenCalled();
  });

  it("should trigger paginationClickHandler callback when page change is clicked", () => {
    const wrapper = mount(root);
    pageChangeMock.mockClear();
    wrapper.find('[data-id="page-next"]').simulate("click", fakeClick);
    expect(pageChangeMock).toHaveBeenCalled();
  });
});
