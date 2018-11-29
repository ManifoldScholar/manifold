import React from "react";
import renderer from "react-test-renderer";
import Link from "../Link";
import build from "test/fixtures/build";
import { Provider } from "react-redux";

describe("Reader.Annotation.Popup.Menu.Link Component", () => {
  const store = build.store();

  it("renders correctly", () => {
    const component = renderer.create(
      <Provider store={store}>
        <Link
          selectedLink={<a href="www.dailyrowan.com" />}
          annotations={[]}
          showAnnotationsInDrawer={() => {}}
        />
      </Provider>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
