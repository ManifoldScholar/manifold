import React from "react";
import renderer from "react-test-renderer";
import Form from "../Form";
import build from "test/fixtures/build";
import { Provider } from "react-redux";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Backend.TwitterQuery.Form Component", () => {
  const store = build.store();
  const twitterQuery = build.entity.twitterQuery("2");

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <Form projectId="1" twitterQuery={twitterQuery} name="twitter-query" />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
