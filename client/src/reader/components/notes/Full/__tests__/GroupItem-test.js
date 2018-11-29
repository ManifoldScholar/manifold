import React from "react";
import renderer from "react-test-renderer";
import GroupItem from "../GroupItem";
import build from "test/fixtures/build";
import { Provider } from "react-redux";
import { wrapWithRouter } from "test/helpers/routing";

describe("Reader.Notes.Full.GroupItem Component", () => {
  const annotation = build.entity.annotation("1");
  const store = build.store();
  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <GroupItem
          annotation={annotation}
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
