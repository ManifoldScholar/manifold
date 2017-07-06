import React from 'react';
import renderer from 'react-test-renderer';
import Date from '../Date';

describe("Backend.Form.Date component", () => {

  const setMock = jest.fn();

  it('renders correctly', () => {
    const component = renderer.create(
      <Date
        value={"1989-10-10"}
        label="Some date"
        set={setMock}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
