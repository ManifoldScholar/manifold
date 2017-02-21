import React, { Component, PropTypes } from 'react';
import { Form } from 'components/backend';
import { Form as GlobalForm } from 'components/global';
import sharedPropsValidation from './propTypes';
import classnames from 'classnames';
import isString from 'lodash/isString';

export default class FormTextInput extends Component {

  static displayName = "Form.TextInput";

  static propTypes = {
    ...sharedPropsValidation,
    placeholder: PropTypes.string,
    focusOnMount: PropTypes.bool,
    instructions: PropTypes.string
  };

  static defaultProps = {
    focusOnMount: false
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.focusOnMount === true) this.inputElement.focus();
  }


  render() {
    const { label, errors, name, placeholder, instructions } = this.props;
    const labelClass = classnames({
      "has-instructions": isString(instructions)
    });

    return (
      <GlobalForm.Errorable
        className="form-input"
        name={name}
        errors={errors}
        label={label}
      >
        <label className={labelClass}>{this.props.label}</label>
        {
          isString(this.props.instructions) ?
            <span className="instructions">{this.props.instructions}</span>
            : null
        }
        <Form.Connect.Set {...this.props} >
          <input
            ref={(input) => { this.inputElement = input; }}
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
