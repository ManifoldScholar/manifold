jest.mock('components/global/HigherOrder/fetchData');

import React from 'react';
import { mount } from 'enzyme';
import Edit from '../Edit';
import { wrapWithRouter } from 'test/helpers/routing';
import { Provider } from 'react-redux';
import build from 'test/fixtures/build';

describe("Backend TextDetail Styles Container", () => {

  const store = build.store();
  const stylesheet = build.entity.stylesheet("2");

  const component = mount(
    wrapWithRouter(
      <Provider store={store} >
        <Edit
          stylesheet={stylesheet}
        />
      </Provider>
    )
  );

  it("renders correctly", () => {
    let tree = component.debug();
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render to null", () => {
    let tree = component.debug();
    expect(tree).not.toBe(null);
  });

});
