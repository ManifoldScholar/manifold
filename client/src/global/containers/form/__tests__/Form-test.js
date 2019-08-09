import React from "react";
import renderer from "react-test-renderer";
import { FormContainer } from "../Form";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Backend Form Form Container", () => {
  const store = build.store();
  const project = build.entity.project("1");
  const createMock = jest.fn();
  const updateMock = jest.fn();
  const session = {
    changed: false,
    dirty: {
      attributes: {},
      relationships: {}
    },
    source: project
  };

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <FormContainer
          session={session}
          dispatch={store.dispatch}
          create={createMock}
          update={updateMock}
          name="test"
        />
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
