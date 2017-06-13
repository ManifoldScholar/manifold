jest.mock('components/global/HigherOrder/fetchData');

import React from 'react';
import { mount } from 'enzyme';
import TextDetailStyles from '../Styles';
import { wrapWithRouter } from 'test/helpers/routing';
import { Provider } from 'react-redux';
import build from 'test/fixtures/build';

describe("Backend TextDetail Styles Container", () => {

  const store = build.store();
  const text = build.entity.text("1");
  const stylesheetOne = build.entity.stylesheet("2");
  const stylesheetTwo = build.entity.stylesheet("3");
  text.relationships.stylesheets = [stylesheetOne, stylesheetTwo];

  const component = mount(
    wrapWithRouter(
      <Provider store={store} >
        <TextDetailStyles
          text={text}
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
