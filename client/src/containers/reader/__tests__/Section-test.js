jest.mock('velocity-react');
jest.mock('components/global/HigherOrder/fetchData');
jest.mock('api/client');

import React from 'react';
import renderer from 'react-test-renderer';
import { SectionContainer } from '../Section';
import { Provider } from 'react-redux';
import build from 'test/fixtures/build';
import { wrapWithRouter } from 'test/helpers/routing';

describe("Reader Section Container", () => {

  const store = build.store();
  const text = build.entity.text("1");
  text.relationships.project = build.entity.project("3");
  const section = build.entity.textSection("2");
  text.attributes.sectionsMap = [section];

  const props = {
    text,
    section,
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
      uiPanels: {}
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
    wrapWithRouter(
      <Provider store={store}>
        <SectionContainer
          {...props}
        />
      </Provider>
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
