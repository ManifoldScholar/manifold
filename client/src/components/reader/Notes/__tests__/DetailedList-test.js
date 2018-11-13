import React from "react";
import renderer from "react-test-renderer";
import DetailedList from "../DetailedList";
import EmptyMessage from "../EmptyMessage";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import Adapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

Enzyme.configure({ adapter: new Adapter() });

const store = build.store();

describe("Reader.Notes.DetailedList Component", () => {
  const sortedAnnotations = [
    {
      name: "Test",
      sectionId: 1,
      annotations: [build.entity.annotation("1"), build.entity.annotation("2")]
    }
  ];

  const clickMock = jest.fn();
  const deleteMock = jest.fn();

  const root = wrapWithRouter(
    <Provider store={store}>
      <DetailedList
        sortedAnnotations={sortedAnnotations}
        handleVisitAnnotation={clickMock}
        handleDeleteAnnotation={deleteMock}
        loaded
      />
    </Provider>
  );

  const component = renderer.create(root);

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
        handleDeleteAnnotation={deleteMock}
        loaded
      />
    );
    expect(wrapper.find(EmptyMessage).length).toBe(1);
  });
});
