import React from "react";
import renderer from "react-test-renderer";
import List from "../List";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";

describe("Reader MyAnnotations List Component", () => {
  const store = build.store();
  const text = build.entity.text("1");
  const annotations = [
    build.entity.annotation("1", { commentsCount: 4 }),
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

  const component = renderer.create(wrapWithRouter(<List {...props} />));

  it("renders correctly", () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render to null", () => {
    let tree = component.toJSON();
    expect(tree).not.toBe(null);
  });
});
