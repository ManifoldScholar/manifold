import React from "react";
import renderer from "react-test-renderer";
import SimpleList from "../SimpleList";
import Project from "backend/components/project";
import build from "test/fixtures/build";
import { Provider } from "react-redux";
import { wrapWithRouter } from "test/helpers/routing";

describe("Frontend.Resource.Card component", () => {
  const projects = [build.entity.project("1"), build.entity.project("2")];
  const currentUser = build.entity.user("1");
  const store = build.store();
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
          <SimpleList
            entities={projects}
            entityComponent={Project.ListItem}
            title={"3030"}
            icon={"avatar64"}
          />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
