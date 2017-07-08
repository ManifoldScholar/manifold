import React from "react";
import { Provider } from "react-redux";
import Editor from "../Editor";
import renderer from "react-test-renderer";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Reader.Annotation.Editor component", () => {
  const annotation = build.entity.annotation("1");
  const store = build.store();

  const cancelMock = jest.fn();
  const saveMock = jest.fn();

  const root = wrapWithRouter(
    <Provider store={store}>
      <Editor
        subject={annotation.attributes.subject}
        startChar={annotation.attributes.startChar}
        endChar={annotation.attributes.endChar}
        startNode={annotation.attributes.startNode}
        endNode={annotation.attributes.endNode}
        cancel={cancelMock}
        saveHandler={saveMock}
      />
    </Provider>
  );

  it("renders correctly", () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
