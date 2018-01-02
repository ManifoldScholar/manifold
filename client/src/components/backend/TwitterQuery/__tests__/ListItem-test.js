import React from "react";
import renderer from "react-test-renderer";
import ListItem from "../ListItem";
import build from "test/fixtures/build";
import { Provider } from "react-redux";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Backend.TwitterQuery.ListItem Component", () => {
  const store = build.store();
  const twitterQuery = build.entity.twitterQuery(
    "2",
    {},
    { project: build.entity.project("2") }
  );

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <ListItem entity={twitterQuery} />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
