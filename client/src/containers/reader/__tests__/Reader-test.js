import React from 'react';
import renderer from 'react-test-renderer';
import { ReaderContainer } from '../Reader';
import { Provider } from 'react-redux';
import build from 'test/fixtures/build';
import { wrapWithRouter } from 'test/helpers/routing';

describe("Reader Reader Container", () => {

  const store = build.store();
  const text = build.entity.text("1");
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
      uiPanels: {}
    },
    appearance: {
      colors: {},
      typography: {
        fontSize: {}
      }
    },
    notifications: {
      notifications: []
    }
  };

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <ReaderContainer
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
