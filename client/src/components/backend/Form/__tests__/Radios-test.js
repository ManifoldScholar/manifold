import React from 'react';
import renderer from 'react-test-renderer';
import Radios from '../Radios';

describe("Backend.Form.Radios component", () => {

  const changeMock = jest.fn();
  const options = [
    {
      label: "option-1",
      value: "1"
    },
    {
      label: "option-2",
      value: "2"
    }
  ];

  it('renders correctly', () => {
    const component = renderer.create(
      <Radios
        options={options}
        label="Label this"
        name="attributes[fake]"
        onChange={changeMock}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
