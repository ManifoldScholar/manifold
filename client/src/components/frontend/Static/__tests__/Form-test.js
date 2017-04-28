import React from 'react';
import renderer from 'react-test-renderer';
import Form from '../Form';

describe("Frontend.Static.Form component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <Form  />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
