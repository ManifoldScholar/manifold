import React from "react";
import renderer from "react-test-renderer";
import DetailedList from "../DetailedList";
import build from "test/fixtures/build";

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
});
