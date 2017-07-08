import React from "react";
import renderer from "react-test-renderer";
import { NewProjectWrapperContainer } from "../Wrapper";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Backend NewProject Wrapper Container", () => {
  const component = renderer.create(
    wrapWithRouter(
      <Provider store={build.store()}>
        <NewProjectWrapperContainer />
      </Provider>
    )
  );

  it("renders correctly", () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render to null", () => {
    let tree = component.toJSON();
    expect(tree).not.toBe(null);
  });
});
