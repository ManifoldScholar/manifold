import React from "react";
import renderer from "react-test-renderer";
import Follow from "../Follow";
import build from "test/fixtures/build";

describe("Frontend.Project.Follow component", () => {
  const project = build.entity.project("1");
  const dispatchMock = jest.fn();

  it("renders correctly", () => {
    const component = renderer.create(
      <Follow
        dispatch={dispatchMock}
        project={project}
        favorites={{}}
        authenticated
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
