import React, { Component, PropTypes } from 'react';
import { Form } from 'components/backend';
import setter from './setter';
import { Form as GlobalForm } from 'components/global';
import classnames from 'classnames';
import isString from 'lodash/isString';

class FormTextInput extends Component {

  static displayName = "Form.TextInput";

  static propTypes = {
    placeholder: PropTypes.string,
    instructions: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.any,
    focusOnMount: PropTypes.bool,
    errors: PropTypes.array,
    password: PropTypes.bool
  };

  static defaultProps = {
    focusOnMount: false,
    password: false
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.focusOnMount === true && this.inputElement) this.inputElement.focus();
  }

  render() {
    const labelClass = classnames({
      "has-instructions": isString(this.props.instructions)
    });
    const inputType = this.props.password ? "password" : "text";

    return (
      <GlobalForm.Errorable
        className="form-input"
        name={this.props.name}
        errors={this.props.errors}
        label={this.props.label}
      >
        <label className={labelClass}>{this.props.label}</label>
        {
          isString(this.props.instructions) ?
            <span className="instructions">{this.props.instructions}</span>
            : null
        }
          <input
            ref={(input) => { this.inputElement = input; }}
            type={inputType}
            placeholder={this.props.placeholder}
            onChange={this.props.onChange}
            value={this.props.value || ""}
          />
      </GlobalForm.Errorable>
    );
  }
}

export default setter(FormTextInput);
