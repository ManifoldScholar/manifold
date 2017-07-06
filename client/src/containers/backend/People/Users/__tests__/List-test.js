import React from 'react';
import renderer from 'react-test-renderer';
import { UsersListContainer } from '../List';
import { wrapWithRouter } from 'test/helpers/routing';
import { Provider } from 'react-redux';
import build from 'test/fixtures/build';

describe("Backend People Users List Container", () => {

  const store = build.store();
  const user = build.entity.user("1");

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store} >
        <UsersListContainer
          users={[user]}
          usersMeta={{
            pagination: build.pagination()
          }}
          match={{
            params: {}
          }}
          route={{}}
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
