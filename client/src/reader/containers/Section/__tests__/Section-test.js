import React from "react";
import renderer from "react-test-renderer";
import { SectionContainer } from "../";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import wrapWithContext from "test/helpers/wrapWithContext";

describe("Reader Section Container", () => {
  const store = build.store();
  const history = build.history();
  const text = build.entity.text("1");
  const settings = build.entity.settings();
  text.relationships.project = build.entity.project("3");
  const section = build.entity.textSection("2");
  text.attributes.sectionsMap = [section];

  const props = {
    text,
    section,
    history,
    settings,
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
      visibilityFilters: {
        highlight: { yours: true, others: true },
        annotation: { yours: true, others: true },
        resource: { all: true },
        readingGroups: { all: true }
      }
    },
    appearance: {
      colors: {},
      typography: {
        fontSize: {},
        margins: {
          current: 100
        }
      }
    },
    notifications: {
      notifications: []
    },
    authentication: {
      authenticated: true,
      currentUser: build.entity.user("5")
    },
    match: {
      params: {
        sectionId: section.id
      }
    }
  };

  const component = renderer.create(
    wrapWithContext(<SectionContainer {...props} />, store)
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
