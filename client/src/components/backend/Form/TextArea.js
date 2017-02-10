import React, { Component, PropTypes } from 'react';
import { Form } from 'components/backend';
import sharedPropsValidation from './propTypes';

export default class FormTextArea extends Component {

  static displayName = "Form.TextArea";

  static propTypes = {
    ...sharedPropsValidation,
    placeholder: PropTypes.string,
    height: PropTypes.number
  };

  static defaultProps = {
    height: 100
  }

  render() {
    return (
      <div className="form-input">
        <label>{this.props.label}</label>
        <Form.Connect.Set {...this.props} >
          <textarea style={{ height: this.props.height }}
            placeholder={this.props.placeholder}
          />
        </Form.Connect.Set>
      </div>
    );
  }

}
