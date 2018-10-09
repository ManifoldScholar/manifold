import React from "react";
import renderer from "react-test-renderer";
import { ProjectCollectionWrapperContainer } from "../Wrapper";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";

describe("Backend.ProjectCollection.Wrapper container", () => {
  const store = build.store();
  const currentUser = build.entity.user("1");
  store.dispatch({
    type: "UPDATE_CURRENT_USER",
    error: false,
    payload: {
      data: currentUser
    }
  });

  it("renders correctly when no project collections", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <ProjectCollectionWrapperContainer
            projectCollections={[]}
            collectionProjects={[]}
            refresh={jest.fn}
            dispatch={store.dispatch}
            history={{}}
            match={{ params: {} }}
          />
        </Provider>
      )
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly when no project collections", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <ProjectCollectionWrapperContainer
            projectCollections={[build.entity.projectCollection("1"), build.entity.projectCollection("2")]}
            collectionProjects={[]}
            refresh={jest.fn}
            dispatch={store.dispatch}
            history={{}}
            match={{ params: { id: "1" } }}
            route={{ routes: [] }}
          />
        </Provider>
      )
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
