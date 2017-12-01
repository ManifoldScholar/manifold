import React from "react";
import ListItem from "../ListItem";
import renderer from "react-test-renderer";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";

describe("Reader.MineForText.ListItem component", () => {
  const annotation = build.entity.annotation("1");
  const store = build.store();

  const root = wrapWithRouter(
    <Provider store={store}>
      <ListItem annotation={annotation} />
    </Provider>
  );

  it("renders correctly", () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
