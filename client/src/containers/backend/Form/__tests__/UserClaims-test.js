import React from "react";
import renderer from "react-test-renderer";
import { FormUserClaims } from "../UserClaims";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Backend Form FormUserClaims Container", () => {
  const user = build.entity.user("1");
  user.relationships.makers = [];
  const onChangeMock = jest.fn();

  const component = renderer.create(
    <Provider store={build.store()}>
      <FormUserClaims
        entity={user}
        label="Test Claims"
        placeholder="Placeholder"
        onChange={onChangeMock}
        api={{}}
      />
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
