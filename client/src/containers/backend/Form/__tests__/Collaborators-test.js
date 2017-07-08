import React from "react";
import renderer from "react-test-renderer";
import { FormCollaborators } from "../Collaborators";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Backend Form FormCollaborators Container", () => {
  const text = build.entity.text("1");
  text.relationships.creators = [build.entity.user("1")];
  text.relationships.contributors = [build.entity.user("2")];

  const component = renderer.create(
    <Provider store={build.store()}>
      <FormCollaborators entity={text} />
    </Provider>
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
