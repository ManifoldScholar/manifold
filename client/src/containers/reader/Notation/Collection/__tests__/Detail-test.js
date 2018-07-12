jest.mock("react-collapse");

import React from "react";
import renderer from "react-test-renderer";
import { NotationCollectionDetailContainer } from "../Detail";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";

describe("Reader Notation Collection Detail Container", () => {
  const store = build.store();
  const collection = build.entity.collection("1");
  collection.relationships.project = build.entity.project("2");
  const resource = build.entity.resource("3", { projectId: "1" });
  const resourceMeta = {
    pagination: build.pagination()
  };
  collection.relationships.resources.push(resource);
  const resources = [resource];

  const props = {
    collection,
    slideshowResources: resources,
    slideshowResourcesMeta: resourceMeta,
    history: {},
    match: {
      params: {
        textId: "2",
        sectionId: "3"
      }
    },
    handleClose: jest.fn()
  };

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <NotationCollectionDetailContainer {...props} />
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
