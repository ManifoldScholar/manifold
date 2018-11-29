import React from "react";
import renderer from "react-test-renderer";
import Layout from "frontend/components/layout";
import { wrapWithRouter } from "test/helpers/routing";

describe("Frontend.Layout.ButtonNavigation component", () => {
  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(<Layout.ButtonNavigation authenticated={true} />)
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("respects the grayBg prop", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Layout.ButtonNavigation grayBg={false} authenticated={true} />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("respects the showFollowing prop", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Layout.ButtonNavigation showFollowing={false} authenticated={true} />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("respects the showBrowse prop", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Layout.ButtonNavigation showBrowse={false} authenticated={true} />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render anything when not logged in on home", () => {
    const component = renderer.create(
      wrapWithRouter(<Layout.ButtonNavigation showBrowse={false} />)
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
