import React from "react";
import AnnotationSelectionWrapper from "../index";
import renderer from "react-test-renderer";
import build from "test/fixtures/build";
import { Provider } from "react-redux";

describe("Reader.Annotation.Selection.Wrapper component", () => {
  const annotation = build.entity.annotation("1");
  const store = build.store();
  const saveMock = jest.fn();

  const root = (
    <Provider store={store}>
      <AnnotationSelectionWrapper
        subject={annotation.attributes.subject}
        startNode={annotation.attributes.startNode}
        endNode={annotation.attributes.endNode}
        startChar={annotation.attributes.startChar}
        endChar={annotation.attributes.endChar}
        saveHandler={saveMock}
        annotating
      />
    </Provider>
  );

  it("renders correctly", () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
