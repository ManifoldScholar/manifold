import React, { Component, PropTypes } from 'react';
import sharedPropsValidation from './propTypes';
import { Form } from 'components/backend';
import classnames from 'classnames';

export default class FormSwitch extends Component {

  static displayName = "Form.Switch";

  static propTypes = {
    ...sharedPropsValidation,
    label: PropTypes.string,

  };

  static defaultProps = {
    dirtyModel: {},
    actions: { set: () => {} },
    layout: "horizontal"
  };

  render() {

    const classes = classnames({
      "boolean-primary": true,
      checked: this.props.value === true
    });

    return (
      <div className="form-input">
        <label>{this.props.label}</label>
        <Form.Connect.Set {...this.props} >
          <Form.Helpers.SwitchInput />
        </Form.Connect.Set>
      </div>
    );
  }

}
