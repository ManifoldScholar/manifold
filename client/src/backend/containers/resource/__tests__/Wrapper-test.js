import React from "react";
import renderer from "react-test-renderer";
import { ResourceWrapperContainer } from "../Wrapper";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Backend Resource Wrapper Container", () => {
  const store = build.store();
  const resource = build.entity.resource("1");
  resource.relationships.project = build.entity.project("1");
  const currentUser = build.entity.user("1");
  store.dispatch({
    type: "UPDATE_CURRENT_USER",
    error: false,
    payload: {
      data: currentUser
    }
  });

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <ResourceWrapperContainer
          resource={resource}
          route={{
            routes: []
          }}
          match={{
            params: {}
          }}
          dispatch={store.dispatch}
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
