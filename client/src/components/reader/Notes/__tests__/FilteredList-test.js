import React from "react";
import renderer from "react-test-renderer";
import FilteredList from "../FilteredList";
import build from "test/fixtures/build";
import { shallow } from "enzyme/build/index";
import EmptyMessage from "../EmptyMessage";

describe("Reader.Notes.FilteredList Component", () => {
  const sortedAnnotations = [
    {
      name: "Test",
      sectionId: 1,
      annotations: [build.entity.annotation("1"), build.entity.annotation("2")]
    }
  ];

  const section = build.entity.textSection("3");

  const filter = {
    formats: ["highlight", "annotation", "bookmark"]
  };

  const clickMock = jest.fn();

  const component = renderer.create(
    <FilteredList
      sortedAnnotations={sortedAnnotations}
      handleSeeAllClick={clickMock}
      handleFilterChange={clickMock}
      section={section}
      filter={filter}
      loaded
    />
  );

  it("renders correctly", () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render to null", () => {
    let tree = component.toJSON();
    expect(tree).not.toBe(null);
  });

  it("renders an empty message when there are no annotations", () => {
    const wrapper = shallow(
      <FilteredList
        sortedAnnotations={[]}
        handleSeeAllClick={clickMock}
        handleFilterChange={clickMock}
        section={section}
        filter={filter}
	    loaded
      />
    );
    expect(wrapper.find(EmptyMessage).length).toBe(1);
  });
});
