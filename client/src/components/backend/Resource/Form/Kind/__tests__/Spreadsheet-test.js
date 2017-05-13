import React from 'react';
import renderer from 'react-test-renderer';
import Spreadsheet from '../Spreadsheet';

describe("Backend.Resource.Form.Spreadsheet component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <Spreadsheet />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

