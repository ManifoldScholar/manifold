import React from "react";
import renderer from "react-test-renderer";
import VisibilityMenuBody from "../VisibilityMenuBody";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Reader.ControlMenu.VisibilityMenuBody Component", () => {
  const props = {
    filter: {
      highlights: { yours: true, others: true },
      annotations: { yours: true, others: true },
      resources: { all: true }
    },
    filterChangeHandler: jest.fn()
  };

  const store = build.store();

  it("renders correctly", () => {
    const component = renderer.create(wrapWithRouter(
      <Provider store={store}>
        <VisibilityMenuBody {...props} />
      </Provider>
    ));
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
