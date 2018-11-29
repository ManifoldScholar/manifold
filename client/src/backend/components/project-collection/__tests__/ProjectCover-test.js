import React from "react";
import renderer from "react-test-renderer";
import ProjectCover from "../ProjectCover";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";

describe("Backend.ProjectCollection.ProjectCover component", () => {
  const projectCollection = build.entity.projectCollection("1");
  const project = build.entity.project("2");
  const store = build.store();

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <ProjectCover
            projectCollection={projectCollection}
            entity={project}
            addHandler={jest.fn}
            removeHandler={jest.fn}
            addable
          />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
