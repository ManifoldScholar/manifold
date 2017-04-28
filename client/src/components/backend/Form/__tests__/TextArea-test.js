import React from 'react';
import renderer from 'react-test-renderer';
import TextArea from '../TextArea';

describe("Backend.Form.TextArea component", () => {

  const changeMock = jest.fn();

  it('renders correctly', () => {
    const component = renderer.create(
      <TextArea
        onChange={changeMock}
        label="Label this"
        name="attributes[fake]"
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
