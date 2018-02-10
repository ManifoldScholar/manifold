import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form } from "components/backend";
import { Form as GlobalForm } from "components/global";
import setter from "./setter";

class FormSwitchArray extends Component {
  static displayName = "Form.SwitchArray";

  static propTypes = {
    set: PropTypes.func,
    value: PropTypes.any,
    options: PropTypes.arrayOf(
      PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
    ).isRequired,
    name: PropTypes.string,
    errors: PropTypes.array,
    label: PropTypes.string
  };

  static defaultProps = {
    value: []
  };

  handleChange(value) {
    const adjustedValues = this.props.value.includes(value)
      ? this.props.value.filter(v => v !== value)
      : [value].concat(this.props.value);

    this.props.set(adjustedValues);
  }

  renderSwitch(option) {
    return (
      <Form.Switch
        key={option.value}
        label={option.label}
        set={() => this.handleChange(option.value)}
        value={this.props.value.includes(option.value)}
      />
    );
  }

  render() {
    return (
      <GlobalForm.Errorable
        className="form-input"
        name={this.props.name}
        nameForError={this.props.label}
        errors={this.props.errors}
      >
        <Form.FieldGroup label={this.props.label} horizontal>
          {this.props.options.map(option => {
            return this.renderSwitch(option);
          })}
        </Form.FieldGroup>
      </GlobalForm.Errorable>
    );
  }
}

export default setter(FormSwitchArray);
