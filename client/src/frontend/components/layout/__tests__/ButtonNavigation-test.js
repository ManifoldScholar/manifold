import React from "react";
import renderer from "react-test-renderer";
import Layout from "frontend/components/layout";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Frontend.Layout.ButtonNavigation component", () => {

  const store = build.store();

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <Layout.ButtonNavigation/>
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("respects the grayBg prop", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}><Layout.ButtonNavigation grayBg={false} /></Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("respects the showFollowing prop", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <Layout.ButtonNavigation showFollowing={false} />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("respects the showBrowse prop", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <Layout.ButtonNavigation showBrowse={false} />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render anything when not logged in on home", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <Layout.ButtonNavigation showBrowse={false} />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
