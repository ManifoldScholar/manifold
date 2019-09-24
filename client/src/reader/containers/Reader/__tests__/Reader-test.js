import React from "react";
import renderer from "react-test-renderer";
import { ReaderContainer } from "../";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";
import { FrontendModeContext } from "helpers/contexts";

describe("Reader Reader Container", () => {
  const store = build.store();
  const text = build.entity.text("1");
  const currentUser = build.entity.user("1");
  text.relationships.project = build.entity.project("3");
  const props = {
    text,
    section: build.entity.textSection("2"),
    route: {
      routes: [
        {
          name: "ReaderSection",
          path: "/read/:textId/section/:sectionId"
        }
      ]
    },
    dispatch: store.dispatch,
    location: {
      pathname: `/read/1/section/2`
    },
    visibility: {
      visibilityFilters: {},
      uiPanels: {}
    },
    appearance: {
      colors: {},
      typography: {
        fontSize: {},
        margins: {}
      }
    },
    notifications: {
      notifications: []
    },
    authentication: {}
  };
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
        <FrontendModeContext.Provider
          value={{ isLibrary: true, isStandalone: false }}
        >
          <ReaderContainer {...props} />
        </FrontendModeContext.Provider>
      </Provider>
    )
  );

  it("renders correctly", () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  // TODO: Fix this test.
  // it("doesn't render to null", () => {
  //   let tree = component.toJSON();
  //   expect(tree).not.toBe(null);
  // });
});
