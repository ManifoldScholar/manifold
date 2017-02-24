import React from 'react';
import renderer from 'react-test-renderer';
import { Layout } from 'components/frontend';

describe("ButtonNavigation component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <Layout.ButtonNavigation
        authenticated={true}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('respects the grayBg prop', () => {
    const component = renderer.create(
      <Layout.ButtonNavigation
        grayBg={false}
        authenticated={true}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('respects the showFollowing prop', () => {
    const component = renderer.create(
      <Layout.ButtonNavigation
        showFollowing={false}
        authenticated={true}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('respects the showBrowse prop', () => {
    const component = renderer.create(
      <Layout.ButtonNavigation
        showBrowse={false}
        authenticated={true}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render anything when not logged in on home", () => {
    const component = renderer.create(
      <Layout.ButtonNavigation
        showBrowse={false}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

