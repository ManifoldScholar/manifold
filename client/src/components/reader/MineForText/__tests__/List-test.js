import React from "react";
import List from "../List";
import renderer from "react-test-renderer";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";

describe("Reader.MineForText.List component", () => {
  const annotations = [
    build.entity.annotation("1"),
    build.entity.annotation("2")
  ];
  const store = build.store();

  const root = wrapWithRouter(
    <Provider store={store}>
      <List annotations={annotations} header={"My annotations"} />
    </Provider>
  );

  it("renders correctly", () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
