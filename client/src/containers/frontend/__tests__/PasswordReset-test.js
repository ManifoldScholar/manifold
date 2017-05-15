import React from 'react';
import renderer from 'react-test-renderer';
import { PasswordResetContainer } from '../PasswordReset';

describe("Frontend PasswordReset Container", () => {

  const component = renderer.create(
    <PasswordResetContainer
      match={{
        params: {}
      }}
      history={{}}
    />
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
