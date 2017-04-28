import React from 'react';
import renderer from 'react-test-renderer';
import Dropdown from '../Dropdown';

describe("Global.Dropdown component", () => {

  function triggerComponentMock() {
    return (
      <div>
        Render me
      </div>
    );
  }

  function bodyComponentMock() {
    return (
      <div>
        Me too
      </div>
    );
  }

  it('renders correctly', () => {
    const component = renderer.create(
      <Dropdown
        triggerComponent={triggerComponentMock}
        bodyComponent={bodyComponentMock}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

