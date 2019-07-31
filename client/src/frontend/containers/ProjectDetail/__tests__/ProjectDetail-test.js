import React from "react";
import renderer from "react-test-renderer";
import ProjectDetailContainer from "../";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import { FrontendModeContext } from "helpers/contexts";

describe("Frontend ProjectDetail Container", () => {
  const store = build.store();
  const project = build.entity.project("1");
  const settings = build.entity.settings();

  const libraryTree = renderer
    .create(
      wrapWithRouter(
        <Provider store={store}>
          <FrontendModeContext.Provider
            value={{ isLibrary: true, isStandalone: false }}
          >
            <ProjectDetailContainer
              dispatch={store.dispatch}
              project={project}
              settings={settings}
              projectResponse={{}}
            />
          </FrontendModeContext.Provider>
        </Provider>
      )
    )
    .toJSON();

  const standaloneTree = renderer
    .create(
      wrapWithRouter(
        <Provider store={store}>
          <FrontendModeContext.Provider
            value={{ isLibrary: false, isStandalone: true, project: {} }}
          >
            <ProjectDetailContainer
              dispatch={store.dispatch}
              project={project}
              settings={settings}
              projectResponse={{}}
            />
          </FrontendModeContext.Provider>
        </Provider>
      )
    )
    .toJSON();

  it("renders correctly in library mode", () => {
    expect(libraryTree).toMatchSnapshot();
  });

  it("doesn't render to null in library mode", () => {
    expect(libraryTree).not.toBe(null);
  });

  it("renders correctly in standalone mode", () => {
    expect(standaloneTree).toMatchSnapshot();
  });

  it("doesn't render to null in standalone mode", () => {
    expect(standaloneTree).not.toBe(null);
  });
});
