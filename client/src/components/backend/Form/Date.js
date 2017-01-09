import React, { Component, PropTypes } from 'react';
import { Form } from 'components/backend';
import sharedPropsValidation from './propTypes';
import classNames from 'classnames';

export default class FormDate extends Component {

  static displayName = "Form.Date";

  static propTypes = {
    ...sharedPropsValidation
  };

  render() {
    return (
      <div className="form-input">
        <label>{this.props.label}</label>
        <Form.Connect.Set manualSet {...this.props} >
          <Form.Helpers.DateInput />
        </Form.Connect.Set>
      </div>
    );
  }

}
