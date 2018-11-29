import React from "react";
import renderer from "react-test-renderer";
import AddButton from "../AddButton";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";

describe("Backend.ProjectCollection.AddButton component", () => {
  const projectCollection = build.entity.projectCollection("1");
  const project = build.entity.project("2");
  const store = build.store();

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <AddButton
            projectCollection={projectCollection}
            project={project}
            dispatch={store.dispatch}
            handleAdd={jest.fn}
            handleRemove={jest.fn}
          />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
