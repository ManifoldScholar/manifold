import React from "react";
import renderer from "react-test-renderer";
import { ProjectDetailCollectionsList } from "../CollectionsList";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Backend ProjectDetail Resource CollectionList Container", () => {
  const store = build.store();
  const project = build.entity.project("1");
  const collectionA = build.entity.collection("2");
  const collectionB = build.entity.collection("3");
  collectionA.relationships.project = project;
  collectionB.relationships.project = project;

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <ProjectDetailCollectionsList
          project={project}
          collections={[collectionA, collectionB]}
          collectionsMeta={{
            pagination: build.pagination()
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
