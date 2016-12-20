import React, { Component, PropTypes } from 'react';
import { Form } from 'components/backend';
import { Form as GlobalForm } from 'components/global';
import sharedPropsValidation from './propTypes';

export default class TextInput extends Component {

  static displayName = "Form.TextInput";

  static propTypes = {
    ...sharedPropsValidation,
    placeholder: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { label, errors, name, placeholder } = this.props;
    return (
      <GlobalForm.Errorable
        className="form-input"
        name={name}
        errors={errors}
        label={label}
      >
        <label>{label}</label>
        <Form.Connect.Set {...this.props} >
          <input
            type="text"
            placeholder={placeholder}
            onChange={this.props.onChange}
            value={this.props.value}
          />
        </Form.Connect.Set>
      </GlobalForm.Errorable>
    );
  }
}
