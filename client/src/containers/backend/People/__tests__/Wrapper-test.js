import React from 'react';
import renderer from 'react-test-renderer';
import { UsersWrapperContainer } from '../Wrapper';
import { wrapWithRouter } from 'test/helpers/routing';
import { Provider } from 'react-redux';
import build from 'test/fixtures/build';

describe("Backend People Wrapper Container", () => {

  const children = (
    <div>
      How is babby formed?
    </div>
  );

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={build.store()} >
        <UsersWrapperContainer
          children={children}
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
