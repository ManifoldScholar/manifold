import React from "react";
import renderer from "react-test-renderer";
import { ProjectCollaboratorsContainer } from "../Collaborators";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Backend Project Collaborators Container", () => {
  const store = build.store();
  const project = build.entity.project("1");
  project.relationships.creators = [build.entity.user("2")];
  project.relationships.contributors = [build.entity.user("3")];

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <ProjectCollaboratorsContainer project={project} />
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
