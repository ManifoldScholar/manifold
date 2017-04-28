import React from 'react';
import renderer from 'react-test-renderer';
import Image from '../Image';

describe("Backend.Resource.Form.Image component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <Image />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

