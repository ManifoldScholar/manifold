import React from "react";
import renderer from "react-test-renderer";
import Manual from "../Manual";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";

describe("Backend.ProjectCollection.Detail.Manual component", () => {
  const projectCollection = build.entity.projectCollection("1", {
    manuallySorted: false
  });
  const project = build.entity.project("2");
  const store = build.store();

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <Manual
            projectCollection={projectCollection}
            orderChangeHandler={() => jest.fn()}
            projects={[project]}
          />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
