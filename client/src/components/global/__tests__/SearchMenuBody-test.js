import React from 'react';
import renderer from 'react-test-renderer';
import SearchMenuBody from '../SearchMenuBody';

describe("Global.SearchMenuBody component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <SearchMenuBody />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

