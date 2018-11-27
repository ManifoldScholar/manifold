import React from "react";
import renderer from "react-test-renderer";
import { ReaderNotesContainer } from "../ReaderNotes";
import { Notes } from "components/reader";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";

describe("Reader ReaderNotes Container", () => {
  const store = build.store();
  const text = build.entity.text("1");
  text.relationships.project = build.entity.project("3");
  const section = build.entity.textSection("2");
  text.attributes.spine = [section.id];
  text.attributes.sectionsMap = [section];
  const myAnnotations = [
    build.entity.annotation("4", { textSectionId: section.id }),
    build.entity.annotation("5", { textSectionId: section.id })
  ];

  const props = {
    text,
    myAnnotations,
    filterable: false,
    dispatch: store.dispatch,
    loaded: true,
    match: {
      params: {
        sectionId: section.id
      }
    }
  };

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <ReaderNotesContainer {...props}>
          <Notes.DetailedList />
        </ReaderNotesContainer>
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
