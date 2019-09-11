import React from "react";
import renderer from "react-test-renderer";
import { PageContainer } from "../";
import build from "test/fixtures/build";
import wrapWithContext from "test/helpers/wrapWithContext";

describe("Frontend Page Container", () => {
  const store = build.store();

  const component = renderer.create(
    wrapWithContext(
      <PageContainer
        page={{
          attributes: {
            body:
              "I rip rock and gravel when I time travel, " +
              "my rhymes bust shots with the beats that I battle."
          }
        }}
      />,
      store
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
