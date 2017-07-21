import React from "react";
import renderer from "react-test-renderer";
import { MyAnnotationsDetailContainer } from "../Detail";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";

describe("Reader MyAnnotations Detail Container", () => {
  const store = build.store();
  const text = build.entity.text("1");
  const annotations = [
    build.entity.annotation("1"),
    build.entity.annotation("2")
  ];
  const appearance = {
    colors: {
      colorScheme: "light"
    },
    typography: {
      font: "serif",
      fontSize: {},
      margins: {
        current: 100
      }
    }
  };
  const props = {
    text,
    annotations,
    dispatch: store.dispatch,
    appearance
  };

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <MyAnnotationsDetailContainer {...props} />
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
