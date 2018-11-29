import React from "react";
import renderer from "react-test-renderer";
import { TwitterQueryEditContainer } from "../Edit";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Backend TwitterQuery Edit Container", () => {
  const store = build.store();
  const twitterQuery = build.entity.twitterQuery("1");

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <TwitterQueryEditContainer
          twitterQuery={twitterQuery}
          dispatch={store.dispatch}
          match={{
            params: {}
          }}
        />
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
