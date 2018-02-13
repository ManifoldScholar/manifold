import React from "react";
import renderer from "react-test-renderer";
import DetailedList from "../DetailedList";
import EmptyMessage from "../EmptyMessage";
import build from "test/fixtures/build";
import Adapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

describe("Reader.Notes.DetailedList Component", () => {
  const sortedAnnotations = [
    {
      name: "Test",
      sectionId: 1,
      annotations: [build.entity.annotation("1"), build.entity.annotation("2")]
    }
  ];

  const clickMock = jest.fn();

  const component = renderer.create(
    <DetailedList
      sortedAnnotations={sortedAnnotations}
      handleVisitAnnotation={clickMock}
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
    const wrapper = Enzyme.shallow(
      <DetailedList
        sortedAnnotations={[]}
        handleVisitAnnotation={clickMock}
        loaded
      />
    );
    expect(wrapper.find(EmptyMessage).length).toBe(1);
  });
});
