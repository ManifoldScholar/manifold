import React from "react";
import renderer from "react-test-renderer";
import { CollectionResourceDetailContainer } from "../CollectionResourceDetail";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";

describe("Frontend CollectionResourceDetail Container", () => {
  const store = build.store();

  const project = build.entity.project("1");
  const collection = build.entity.collection("2");
  const resource = build.entity.resource("3");
  const collectionResource = build.entity.collectionResource("4");
  collection.relationships.resources.push(resource);
  collectionResource.relationships.resource = resource;
  resource.relationships.collectionResources.push(collectionResource);
  project.relationships.resources.push(resource);

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <CollectionResourceDetailContainer
          collection={collection}
          collectionResource={collectionResource}
          resource={resource}
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
