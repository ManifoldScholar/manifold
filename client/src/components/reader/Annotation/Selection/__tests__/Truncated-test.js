import React from 'react';
import Truncated from '../Truncated';
import { mount } from 'enzyme';

describe("Reader.Annotation.Selection.Truncated Component", () => {

  it('renders correctly', () => {
    const component = mount(
      <Truncated
        truncate={40}
        selection="You will remember we from now til forever, G. I am infinity, lyrics flowing endlessly."
      />
    );
    let tree = component.debug();
    expect(tree).toMatchSnapshot();
  });
});
