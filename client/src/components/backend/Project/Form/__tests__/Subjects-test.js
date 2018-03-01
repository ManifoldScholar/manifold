import React from "react";
import renderer from "react-test-renderer";
import { ProjectSubjects } from "../Subjects";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Backend Project Form Subjects Component", () => {
  const store = build.store();
  const project = build.entity.project("1");
  project.relationships.subjects = [build.entity.subject("2")];
  const currentUser = build.entity.user("1");
  const authentication = {
    authenticated: true,
    currentUser: currentUser
  };

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <ProjectSubjects project={project} authentication={authentication} />
      </Provider>
    )
  );

  it("renders correctly", () => {
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render to null", () => {
    const tree = component.toJSON();
    expect(tree).not.toBe(null);
  });
});
