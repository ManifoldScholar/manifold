import React, { Component } from 'react';
import PropTypes from 'prop-types';
import renderer from 'react-test-renderer';
import { Form } from 'components/backend';
import { shallow, mount, render } from 'enzyme';

import setter from '../setter';

class WithPropTypes extends Component {
  static propTypes = {
    foo: PropTypes.string
  };

  render() {
    return <div />
  }
}

const Settable = setter(WithPropTypes );

describe("setter higher order component", () => {

  const mockedSetAction = jest.fn();

  const mockedFormProps = {
    sessionKey: "123",
    dirtyModel: { attributes: {}},
    sourceModel: { attributes: {property: "foo" }},
    actions: { "set": mockedSetAction }
  };

  const settable = (
    <Settable
      {...mockedFormProps}
      foo="bar"
      bar="foo"
      label="A form label"
      name="attributes[property]"
    />
  );

  describe("applied to a component with a name prop", () => {

    const component = renderer.create(settable);
    const tree = component.toJSON();
    const wrapper = shallow(settable).first().shallow();
    const instance = wrapper.instance();
    const props = instance.props;

    it('renders correctly', () => {
      expect(tree).toMatchSnapshot();
    });

    it('transfers props defined in propTypes', () => {
      expect(props.foo).toBe("bar");
    });

    it('transfers props not defined in propTypes', () => {
      expect(props.bar).toBe("foo");
    });

    it('transfers the name prop to settable components', () => {
      expect(props.name).toBeDefined();
    });

    it('passes a set prop', () => {
      expect(props.set).toBeDefined();
    });

    it('passes an onChange prop', () => {
      expect(props.onChange).toBeDefined();
    });

    it('passes a value prop with the current value', () => {
      expect(props.value).toBe("foo");
    });

    it('passes an initial value prop with the initial value', () => {
      expect(props.initialValue).toBe("foo");
    });

    it('passes a setOther prop', () => {
      expect(props.setOther).toBeDefined();
    });

    it('does not transfer the readFrom prop to settable components', () => {
      expect(props.readFrom).not.toBeDefined();
    });

    it('does not transfer the actions prop to settable components', () => {
      expect(props.actions).not.toBeDefined();
    });

    it('does not transfer the dirtyModel prop to settable components', () => {
      expect(props.dirtyModel).not.toBeDefined();
    });

    it('does not transfer the sourceModel prop to settable components', () => {
      expect(props.sourceModel).not.toBeDefined();
    });

    it('triggers the set action when the child set prop is executed', () => {
      mockedSetAction.mockClear();
      props.set('bar');
      expect(mockedSetAction).toHaveBeenCalled();
    })

    it('triggers the set action when the child onChange prop is executed', () => {
      mockedSetAction.mockClear();
      const mockEvent = { target: { value: "bar" }};
      props.onChange(mockEvent);
      expect(mockedSetAction).toHaveBeenCalled();
    })

  });

});
