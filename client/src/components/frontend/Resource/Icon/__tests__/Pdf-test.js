import React from 'react';
import renderer from 'react-test-renderer';
import Pdf from '../Pdf';

describe("Frontend.Resource.Pdf component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <Pdf />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

