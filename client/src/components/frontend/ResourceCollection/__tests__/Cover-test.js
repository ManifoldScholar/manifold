import React from "react";
import renderer from "react-test-renderer";
import Cover from "../Cover";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Frontend.ResourceCollection.Cover component", () => {
  const collection = build.entity.collection("1");
  collection.relationships.resources.push(build.entity.resource("2"));
  collection.relationships.resources.push(build.entity.resource("3"));

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Cover
          collection={collection}
          urlCreator={collection =>
            `/project/slug-1/${collection.attributes.slug}`}
        />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
