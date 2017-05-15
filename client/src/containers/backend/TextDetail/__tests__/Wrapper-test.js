jest.mock('components/global/HigherOrder/fetchData');

import React from 'react';
import renderer from 'react-test-renderer';
import { TextDetailWrapperContainer } from '../Wrapper';
import { wrapWithRouter } from 'test/helpers/routing';
import { Provider } from 'react-redux';
import build from 'test/fixtures/build';

describe("Backend TextDetail Wrapper Container", () => {

  const store = build.store();
  const text = build.entity.text("1");
  text.relationships.creators = [build.entity.user("2")];
  text.relationships.contributors = [build.entity.user("3")];
  text.relationships.project = build.entity.project("4");

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store} >
        <TextDetailWrapperContainer
          text={text}
          dispatch={store.dispatch}
          route={{
            routes: []
          }}
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
