import React from "react";
import renderer from "react-test-renderer";
import { Annotatable } from "../Annotatable";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";

describe("Reader Annotation Annotatable Container", () => {
  const store = build.store();
  const text = build.entity.text("1");
  const section = build.entity.textSection("2");
  const project = build.entity.project("3");
  const history = build.history();
  const location = {
    pathname: `/read/1/section/2`
  };
  const props = {
    history,
    location,
    text,
    section,
    textId: text.id,
    projectId: project.id,
    sectionId: section.id,
    dispatch: store.dispatch,
    containerSize: 100,
    bodySelector: "main",
    render: pendingAnnotation => <div>Content</div>
  };

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <Annotatable {...props} />
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
