import React from 'react';
import renderer from 'react-test-renderer';
import Select from '../Select';

describe("Backend.Form.Select component", () => {

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
      <Select
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
