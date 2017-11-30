import React from "react";
import renderer from "react-test-renderer";
import { MineForTextContainer } from "../MineForText";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";

describe("Reader.Annotation.MineForText Container", () => {
  const store = build.store();
  const text = build.entity.text("1");
  const section = build.entity.textSection("2", { textId: text.id });
  text.attributes.sectionsMap = [
    { id: section.id, name: section.attributes.name }
  ];
  text.attributes.spine = [section.id];
  const annotations = [
    build.entity.annotation("3", { textSectionId: section.id }),
    build.entity.annotation("4", { textSectionId: section.id })
  ];
  const props = {
    text,
    sectionId: section.id,
    annotations,
    dispatch: store.dispatch
  };

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <MineForTextContainer {...props} />
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
