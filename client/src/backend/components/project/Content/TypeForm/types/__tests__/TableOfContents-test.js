import React from "react";
import renderer from "react-test-renderer";
import TableOfContents from "../TableOfContents";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";

describe("Backend.Project.Content.TypeForm.TableOfContents component", () => {
  const store = build.store();
  const contentBlock = {
    id: "1",
    type: "contentBlocks",
    attributes: {}
  };
  const project = build.entity.project(
    "1",
    {},
    { texts: [build.entity.text("1")], contentBlocks: [contentBlock] }
  );

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <TableOfContents
            contentBlock={contentBlock}
            project={project}
            setOther={jest.fn}
          />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
