import React from "react";
import renderer from "react-test-renderer";
import RequireAbility from "../RequireAbility";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";

describe("Global HigherOrder RequireAbility Container", () => {
  const annotation = build.entity.annotation("1", {
    abilities: { create: true }
  });
  const noAbilityAnnotation = build.entity.annotation("1", {
    abilities: { create: false }
  });
  const child = <div>How is babby formed?</div>;

  it("renders correctly when role matches", () => {
    const component = renderer.create(
      wrapWithRouter(
        <RequireAbility
          entity={annotation}
          requiredAbility="create"
          children={child}
        />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly to null when role doesn't match", () => {
    const component = renderer.create(
      wrapWithRouter(
        <RequireAbility
          entity={noAbilityAnnotation}
          requiredAbility="create"
          children={child}
        />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
