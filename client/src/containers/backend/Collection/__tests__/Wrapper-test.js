import React from "react";
import renderer from "react-test-renderer";
import { CollectionWrapperContainer } from "../Wrapper";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Backend Collection Wrapper Container", () => {
  const store = build.store();
  const collection = build.entity.collection("1");
  collection.relationships.resources = [
    build.entity.resource("2"),
    build.entity.resource("3")
  ];
  collection.relationships.project = build.entity.project("4");

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <CollectionWrapperContainer
          collection={collection}
          route={{
            routes: []
          }}
          match={{
            params: {}
          }}
          dispatch={store.dispatch}
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
