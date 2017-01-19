import React, { Component, PropTypes } from 'react';
import sharedPropsValidation from './propTypes';
import { Form } from 'components/backend';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask.js';
import fill from 'lodash/fill';
import startsWith from 'lodash/startsWith';
import replace from 'lodash/replace';

export default class FormMaskedTextInput extends Component {

  static displayName = "Form.MaskedTextInput";

  static propTypes = {
    ...sharedPropsValidation,
    mask: PropTypes.oneOfType(
      PropTypes.string.isRequired,
      PropTypes.array.isRequired
    ),
    placeholder: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  currencyMask() {
    return createNumberMask({
      prefix: '$',
      allowDecimal: true
    });
  }

  hashTagMask() {
    return (raw) => {
      const wordChar = /^[A-Za-z0-9\-]$/;
      const notWordChar = /[^A-Za-z0-9\-]/g;
      const adjusted = raw.replace(notWordChar, '').replace('_', '');
      const length = adjusted.length;
      let mask = Array(length);
      mask.unshift("#");
      fill(mask, wordChar, 1);
      if (mask.length === 1) mask = [/#/];
      return mask;
    };
  }

  mask() {
    if (this.props.mask === "currency") {
      return this.currencyMask();
    }
    if (this.props.mask === "hashtag") {
      return this.hashTagMask();
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
            placeholder={this.props.placeholder}
          />
        </Form.Connect.Set>
      </div>
    );
  }
}
