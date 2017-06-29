import React from 'react';
import renderer from 'react-test-renderer';
import { MakersEditContainer } from '../Edit';
import { wrapWithRouter } from 'test/helpers/routing';
import { Provider } from 'react-redux';
import build from 'test/fixtures/build';

describe("Backend People Makers Edit Container", () => {

  const store = build.store();
  const maker = build.entity.user("1");
  maker.type = "makers";
  maker.relationships.users = [];

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store} >
        <MakersEditContainer
          maker={maker}
          dispatch={store.dispatch}
          match={{
            params: {}
          }}
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
