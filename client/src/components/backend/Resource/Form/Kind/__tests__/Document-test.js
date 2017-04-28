import React from 'react';
import renderer from 'react-test-renderer';
import Document from '../Document';

describe("Backend.Resource.Form.Document component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <Document />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

