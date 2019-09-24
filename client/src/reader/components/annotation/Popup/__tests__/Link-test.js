import React from "react";
import renderer from "react-test-renderer";
import Link from "../Link";
import build from "test/fixtures/build";
import wrapWithContext from "test/helpers/wrapWithContext";

jest.mock("react-transition-group", () => {
  return {
    CSSTransition: jest.fn(({ children, in: show }) => (show ? children : null))
  };
});

describe("Reader.Annotation.Popup.Menu.Link Component", () => {
  const store = build.store();

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithContext(
        <Link
          selectedLink={<a href="www.dailyrowan.com" />}
          annotations={[]}
          showAnnotationsInDrawer={() => {}}
        />,
        store
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
