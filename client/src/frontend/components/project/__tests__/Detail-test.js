import React from "react";
import renderer from "react-test-renderer";
import Detail from "../Detail";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";

describe("Frontend.Project.Detail component", () => {
  const project = build.entity.project("1");
  project.relationships.events = [
    build.entity.event("2"),
    build.entity.tweetEvent("3")
  ];
  const activityProject = build.entity.project("4");
  activityProject.relationships.events = [
    build.entity.event("5"),
    build.entity.tweetEvent("6")
  ];
  activityProject.attributes.hideActivity = true;
  const dispatchMock = jest.fn();
  const store = build.store();

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <Detail dispatch={dispatchMock} project={project} />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly when hideActivity is true", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <Detail dispatch={dispatchMock} project={activityProject} />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
