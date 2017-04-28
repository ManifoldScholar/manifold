import React from 'react';
import renderer from 'react-test-renderer';
import EdgeLockScroll from '../EdgeLockScroll';

describe("Global.Utility.EdgeLockScroll component", () => {

  const children = (
    <div>
      How is babby formed?
    </div>
  );

  it('renders correctly', () => {
    const component = renderer.create(
      <EdgeLockScroll
        children={children}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
