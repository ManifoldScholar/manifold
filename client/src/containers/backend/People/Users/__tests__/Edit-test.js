import React from 'react';
import renderer from 'react-test-renderer';
import { UsersEditContainer } from '../Edit';
import { wrapWithRouter } from 'test/helpers/routing';
import { Provider } from 'react-redux';
import build from 'test/fixtures/build';

describe("Backend People Users Edit Container", () => {

  const store = build.store();
  const user = build.entity.user("1");
  user.relationships.makers = [];

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store} >
        <UsersEditContainer
          user={user}
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
