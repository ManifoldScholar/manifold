import React from 'react';
import renderer from 'react-test-renderer';
import { Form } from 'components/backend';
import { shallow, mount, render } from 'enzyme';
import { Event } from 'components/frontend';

describe("Backend.Form.TextInput component", () => {

  const onChange = jest.fn();

  const element = (
    <Form.TextInput
      label="A form label"
      name="attributes[property]"
      mask="hashtag"
      onChange={onChange}
    />
  );

  it('renders correctly', () => {
    const component = renderer.create(element);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
