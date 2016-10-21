import React from 'react';
import renderer from 'react-test-renderer';
import { Layout } from 'components/frontend';

describe("ButtonNavigation component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <Layout.ButtonNavigation />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('respects the grayBg prop', () => {
    const component = renderer.create(
      <Layout.ButtonNavigation grayBg={false} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('respects the showFollowing prop', () => {
    const component = renderer.create(
      <Layout.ButtonNavigation showFollowing={false} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('respects the showBrowse prop', () => {
    const component = renderer.create(
      <Layout.ButtonNavigation showBrowse={false} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });


});

