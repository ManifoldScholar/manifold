import React from "react";
import renderer from "react-test-renderer";
import Events from "../Events";
import build from "test/fixtures/build";
import { FrontendModeContext } from "helpers/contexts";
import wrapWithContext from "test/helpers/wrapWithContext";

describe("Frontend.Project.Events component", () => {
  const store = build.store();
  const project = build.entity.project("1");
  const events = [build.entity.event("1"), build.entity.event("2")];
  const pagination = {
    currentPage: 1,
    perPage: 5,
    totalCount: 10,
    nextPage: 2,
    prevPage: 0,
    totalPages: 2
  };

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithContext(
        <FrontendModeContext.Provider
          value={{ isLibrary: true, isStandalone: false }}
        >
          <Events project={project} events={events} pagination={pagination} />
        </FrontendModeContext.Provider>,
        store
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
