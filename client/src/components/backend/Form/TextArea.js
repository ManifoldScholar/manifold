import React, { Component, PropTypes } from 'react';
import { Form } from 'components/backend';
import sharedPropsValidation from './propTypes';

export default class FormTextArea extends Component {

  static displayName = "Form.TextArea";

  static propTypes = {
    ...sharedPropsValidation,
    placeholder: PropTypes.string
  };

  render() {
    return (
      <div className="form-input">
        <label>{this.props.label}</label>
        <Form.Connect.Set {...this.props} >
          <textarea
            placeholder={this.props.placeholder}
          />
        </Form.Connect.Set>
      </div>
    );
  }

}
