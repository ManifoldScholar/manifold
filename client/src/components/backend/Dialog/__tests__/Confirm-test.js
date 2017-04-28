import React from 'react';
import { mount } from 'enzyme';
import Confirm from '../Confirm';
import { wrapWithRouter, renderWithRouter } from 'test/helpers/routing';

describe("Backend.Dialog.Confirm Component", () => {

  const resolveMock = jest.fn();
  const rejectMock = jest.fn();

  it('renders correctly', () => {
    const component = mount(
      wrapWithRouter(
        <Confirm
          heading="Player's Ball"
          message="All the players came from far and wide"
          reject={rejectMock}
          resolve={resolveMock}
        />
      )
    );

    // Confirm has event listeners attached to document,
    // so we need to use Enzyme to mock that.
    // debug() outputs the markdown generated.
    let tree = component.debug();
    expect(tree).toMatchSnapshot();
  });

});
