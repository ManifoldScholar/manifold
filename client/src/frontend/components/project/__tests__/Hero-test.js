import React from "react";
import renderer from "react-test-renderer";
import Hero from "../Hero";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import { FrontendModeContext } from "helpers/contexts";
import BackLink from "../../back-link";

describe("Frontend.Project.Hero component", () => {
  const actionCallout = build.entity.actionCallout("1");
  const project = build.entity.project(
    "1",
    {},
    { actionCallouts: [actionCallout] }
  );
  const store = build.store();

  const refMock = element => {
    return { style: { objectFit: "" } };
  };

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <FrontendModeContext.Provider
            value={{ isLibrary: true, isStandalone: false }}
          >
            <Hero project={project} />
          </FrontendModeContext.Provider>
        </Provider>
      ),
      { createNodeMock: refMock }
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly when object-fit is unsupported", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <FrontendModeContext.Provider
            value={{ isLibrary: true, isStandalone: false }}
          >
            <Hero project={project} />
          </FrontendModeContext.Provider>
        </Provider>
      ),
      {
        createNodeMock: element => {
          return { style: {} };
        }
      }
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
