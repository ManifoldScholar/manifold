import React from "react";
import renderer from "react-test-renderer";
import Annotate from "../Annotate";
import build from "test/fixtures/build";
import { Provider } from "react-redux";

describe("Reader.Annotation.Popup.Menu.Annotate Component", () => {
  const store = build.store();
  const text = build.entity.text("1");

  it("renders correctly when not logged in", () => {
    const component = renderer.create(
      <Provider store={store}>
        <Annotate
          actions={{
            openNewAnnotationDrawer: jest.fn(),
            openNewNotationDrawer: jest.fn(),
            destroyAnnotation: jest.fn(),
            showLogin: jest.fn(),
            createHighlight: jest.fn()
          }}
          showShare={() => {}}
          text={text}
        />
      </Provider>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
