import React from 'react';
import renderer from 'react-test-renderer';
import { ResourceDetailWrapperContainer } from '../Wrapper';
import { wrapWithRouter } from 'test/helpers/routing';
import { Provider } from 'react-redux';
import build from 'test/fixtures/build';

describe("Backend ResourceDetail Wrapper Container", () => {

  const store = build.store();
  const resource = build.entity.resource("1");
  resource.relationships.project = build.entity.project("1");

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store} >
        <ResourceDetailWrapperContainer
          resource={resource}
          route={{
            routes: []
          }}
          match={{
            params: {}
          }}
          dispatch={store.dispatch}
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
