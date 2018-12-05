import React from "react";
import renderer from "react-test-renderer";
import Search from "../index";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";

describe("Reader SearchContainer", () => {
  const store = build.store();
  const props = {
    searchQueryState: {},
    setQueryState: jest.fn,
    setPage: jest.fn,
    dispatch: store.dispatch,
    history: {},
    location: {},
    match: {}
  };

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <Search {...props} />
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
