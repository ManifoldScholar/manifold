import React from 'react';
import renderer from 'react-test-renderer';
import LoadingBar from '../LoadingBar';

describe("Global.LoadingBar component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <LoadingBar
        loading
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

