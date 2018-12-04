import React from "react";
import renderer from "react-test-renderer";
import Group from "../Group";
import build from "test/fixtures/build";
import { Provider } from "react-redux";
import { wrapWithRouter } from "test/helpers/routing";

describe("Reader.Notes.Full.Group Component", () => {
  const store = build.store();
  const annotations = [
    build.entity.annotation("1"),
    build.entity.annotation("2")
  ];

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <Group
          header="Test"
          annotations={annotations}
          handleDeleteAnnotation={jest.fn()}
          handleUpdateAnnotation={jest.fn()}
          handleVisitAnnotation={jest.fn()}
        />
      </Provider>
    )
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
