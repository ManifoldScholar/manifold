import React, { Component, PropTypes } from 'react';
import sharedPropsValidation from './propTypes';
import { Form } from 'components/backend';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask.js';

export default class MaskedTextInput extends Component {

  static displayName = "Form.MaskedTextInput";

  static propTypes = {
    ...sharedPropsValidation,
    mask: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
  }

  mask() {
    if (this.props.mask === "currency") {
      return createNumberMask({
        prefix: '$',
        allowDecimal: true
      });
    }
    if (this.props.mask === "hashtag") {
      return ['#', /^\w+$/, /^\w+$/, /^\w+$/, /^\w+$/, /^\w+$/, /^\w+$/, /^\w+$/];
    }
    return this.props.mask;
  }

  render() {

    const mask = this.mask();
    return (
      <div className="form-input">
        <label>{this.props.label}</label>
        <Form.Connect.Set {...this.props} >
          <MaskedInput
            type="text"
            mask={mask}
          />
        </Form.Connect.Set>
      </div>
    );
  }
}
