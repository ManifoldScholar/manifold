import React from "react";
import renderer from "react-test-renderer";
import ListItem from "../ListItem";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";

describe("Backend.Project.ListItem component", () => {

  const project = build.entity.project("1");
  const store = build.store();
  const currentUser = build.entity.user("1");
  store.dispatch({
    type: "UPDATE_CURRENT_USER",
    error: false,
    payload: {
      data: currentUser
    }
  });

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <ListItem entity={project} />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
