import React from "react";
import renderer from "react-test-renderer";
import NotFound from "../";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Frontend Not Found Container", () => {
  const store = build.store();
  const component = renderer.create(
    <Provider store={store}>
      <NotFound />
    </Provider>
  );

  it("renders correctly", () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders to null", () => {
    let tree = component.toJSON();
    expect(tree).toBe(null);
  });
});
