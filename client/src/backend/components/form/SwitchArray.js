import React, { Component } from "react";
import PropTypes from "prop-types";
import Form from "backend/components/form";
import GlobalForm from "global/components/form";
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
    label: PropTypes.string,
    focusOnMount: PropTypes.bool
  };

  static defaultProps = {
    value: [],
    focusOnMount: false
  };

  handleChange(value) {
    const adjustedValues = this.props.value.includes(value)
      ? this.props.value.filter(v => v !== value)
      : [value].concat(this.props.value);

    this.props.set(adjustedValues);
  }

  renderSwitch(option, index) {
    const focusOnMount = this.props.focusOnMount && index === 0;

    return (
      <Form.Switch
        key={option.value}
        label={option.label}
        set={() => this.handleChange(option.value)}
        value={this.props.value.includes(option.value)}
        focusOnMount={focusOnMount}
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
          {this.props.options.map((option, index) => {
            return this.renderSwitch(option, index);
          })}
        </Form.FieldGroup>
      </GlobalForm.Errorable>
    );
  }
}

export default setter(FormSwitchArray);
