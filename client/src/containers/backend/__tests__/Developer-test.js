import React from 'react';
import renderer from 'react-test-renderer';
import { DeveloperContainer } from '../Developer';
import { wrapWithRouter } from 'test/helpers/routing';

describe("Backend Developer Container", () => {

  const component = renderer.create(
    <DeveloperContainer />
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
