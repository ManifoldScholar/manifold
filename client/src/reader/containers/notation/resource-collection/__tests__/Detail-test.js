jest.mock("react-collapse");

import React from "react";
import renderer from "react-test-renderer";
import { NotationResourceCollectionDetailContainer } from "../Detail";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";

describe("Reader Notation ResourceCollection Detail Container", () => {
  const store = build.store();
  const resourceCollection = build.entity.resourceCollection("1");
  resourceCollection.relationships.project = build.entity.project("2");
  const resource = build.entity.resource("3", { projectId: "1" });
  const resourceMeta = {
    pagination: build.pagination()
  };
  resourceCollection.relationships.resources.push(resource);
  const resources = [resource];

  const props = {
    resourceCollection,
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
        <NotationResourceCollectionDetailContainer {...props} />
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
