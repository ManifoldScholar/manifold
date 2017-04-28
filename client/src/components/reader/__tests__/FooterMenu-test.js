import React from 'react';
import renderer from 'react-test-renderer';
import FooterMenu from '../FooterMenu';

describe("Reader.FooterMenu Component", () => {

  const visibility = {
    uiPanels: {}
  };

  const root = (
    <FooterMenu
      visibility={visibility}
    />
  );

  it('renders correctly', () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
