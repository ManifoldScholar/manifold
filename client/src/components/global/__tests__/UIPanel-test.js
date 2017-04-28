import React from 'react';
import renderer from 'react-test-renderer';
import UIPanel from '../UIPanel';

describe("Global.UIPanel component", () => {

  function bodyComponentMock() {
    return (
      <div>
        Render me
      </div>
    );
  }

  it('renders correctly', () => {
    const component = renderer.create(
      <UIPanel
        id="show"
        visibility={{
          show: true
        }}
        bodyComponent={bodyComponentMock}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

