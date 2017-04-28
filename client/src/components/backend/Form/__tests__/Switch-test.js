import React from 'react';
import renderer from 'react-test-renderer';
import Switch from '../Switch';

describe("Backend.Form.Switch component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <Switch
        label="Label this"
        name="attributes[fake]"
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
