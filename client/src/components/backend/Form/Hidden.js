import React, { Component, PropTypes } from 'react';
import { Form } from 'components/backend';
import { Form as GlobalForm } from 'components/global';
import sharedPropsValidation from './propTypes';
import classnames from 'classnames';
import isString from 'lodash/isString';

const { label, ...validation} = sharedPropsValidation;

export default class FormHiddenInput extends Component {

  static displayName = "Form.HiddenInput";

  static propTypes = {
    ...validation
  };

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps() {

  }

  render() {
    return(
      <Form.Connect.Set {...this.props} manualSet >
        <Form.Helpers.HiddenInput />
      </Form.Connect.Set>
    )
  }
}
