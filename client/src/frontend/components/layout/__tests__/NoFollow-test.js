import React from "react";
import renderer from "react-test-renderer";
import NoFollow from "../NoFollow";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Frontend.Layout.NoFollow component", () => {

  const store = build.store();

  it("renders correctly", () => {
    const component = renderer.create(wrapWithRouter(
      <Provider store={store}><NoFollow /></Provider>
    ));
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
