import React from 'react';
import renderer from 'react-test-renderer';
import { Form } from 'components/backend';
import { shallow, mount, render } from 'enzyme';
import { Event } from 'components/frontend';
import Set from '../Connect/Set';

describe("Form.TextInput component", () => {

  const onChange = jest.fn();

  const element = (
    <Form.TextInput
      label="A form label"
      name="attributes[property]"
      mask="hashtag"
      onChange={onChange}
    />
  )

  it('renders correctly', () => {
    const component = renderer.create(element);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('triggers a change event', () => {
    const component = shallow(element);
    component.find('input').simulate('change');
    expect(onChange.mock.calls.length).toBe(1);
    onChange.mockClear();
  });

});
