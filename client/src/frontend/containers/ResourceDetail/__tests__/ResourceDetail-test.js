import React from "react";
import renderer from "react-test-renderer";
import { ResourceDetailContainer } from "../";
import build from "test/fixtures/build";
import { FrontendModeContext } from "helpers/contexts";
import BackLink from "frontend/components/back-link";
import wrapWithContext from "test/helpers/wrapWithContext";
describe("Frontend ResourceDetail Container", () => {
  const store = build.store();
  const settings = build.entity.settings("1");
  const project = build.entity.project("1");
  const resource = build.entity.resource("2", { projectId: "1" });
  resource.relationships.project = project;

  const component = renderer.create(
    wrapWithContext(
      <BackLink.Provider>
        <FrontendModeContext.Provider
          value={{ isLibrary: true, isStandalone: false }}
        >
          <ResourceDetailContainer
            settings={settings}
            dispatch={store.dispatch}
            project={project}
            resource={resource}
          />
        </FrontendModeContext.Provider>
      </BackLink.Provider>,
      store
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
