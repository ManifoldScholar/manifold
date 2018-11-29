import React from "react";
import renderer from "react-test-renderer";
import Orderable from "../Orderable";
import Project from "backend/components/project";
import build from "test/fixtures/build";
import { Provider } from "react-redux";
import { wrapWithRouter } from "test/helpers/routing";

describe("Backend.List.Orderable component", () => {
  const projects = [
    build.entity.project("1"),
    build.entity.project("2"),
    build.entity.project("3")
  ];
  const store = build.store();

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <Orderable
            entities={projects}
            orderChangeHandler={() => jest.func()}
            entityComponent={Project.ListItem}
          />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
