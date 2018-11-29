import React from "react";
import renderer from "react-test-renderer";
import { TwitterQueryNewContainer } from "../New";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Backend TwitterQuery New Container", () => {
  const store = build.store();

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <TwitterQueryNewContainer
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
