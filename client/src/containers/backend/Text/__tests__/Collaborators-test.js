import React from "react";
import renderer from "react-test-renderer";
import { TextCollaboratorsContainer } from "../Collaborators";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Backend Text Collaborators Container", () => {
  const store = build.store();
  const text = build.entity.text("1");
  text.relationships.creators = [build.entity.user("2")];
  text.relationships.contributors = [build.entity.user("3")];

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <TextCollaboratorsContainer text={text} />
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
