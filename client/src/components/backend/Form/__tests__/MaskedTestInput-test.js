import React from 'react';
import { mount } from 'enzyme';
import MaskedTextInput from '../MaskedTextInput';

describe("Backend.Form.MaskedTextInput component", () => {

  const changeMock = jest.fn();

  it('renders correctly', () => {
    const component = mount(
      <MaskedTextInput
        mask={[/\d/, /\d/, /\d/, /\d/]}
        placeholder="Hold my place"
        onChange={changeMock}
        label="Label this"
        value="attributes[fake]"
      />
    );

    // MaskedTextInput uses MaskedInput from react-text-mask.
    // Mounting with Enzyme to avoid mocking that component.
    // debug() outputs the markdown generated.
    let tree = component.debug();
    expect(tree).toMatchSnapshot();
  });

});
