import React from "react";
import renderer from "react-test-renderer";
import { ProjectCollectionNew } from "../New";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";

describe("Backend.ProjectCollection.New container", () => {
  const store = build.store();
  store.dispatch({
    type: "UPDATE_CURRENT_USER",
    error: false,
    payload: {
      data: build.entity.user("1")
    }
  });

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <ProjectCollectionNew
          dispatch={store.dispatch}
          successHandler={jest.fn}
        />
      </Provider>
    )
  );
  const tree = component.toJSON();

  it("renders correctly", () => {
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render to null", () => {
    expect(tree).not.toBe(null);
  });
});
