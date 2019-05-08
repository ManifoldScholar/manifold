import React, { Component } from "react";
import PropTypes from "prop-types";
import GlobalForm from "global/components/form";
import Switch from "./Switch";
import FieldGroup from "./FieldGroup";
import setter from "./setter";

class FormSwitchArray extends Component {
  static defaultProps = {
    value: [],
    focusOnMount: false
  };

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

  handleChange(value) {
    const adjustedValues = this.props.value.includes(value)
      ? this.props.value.filter(v => v !== value)
      : [value].concat(this.props.value);

    this.props.set(adjustedValues);
  }

  renderSwitch(option, index) {
    const focusOnMount = this.props.focusOnMount && index === 0;

    return (
      <Switch
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
        <FieldGroup label={this.props.label} horizontal>
          {this.props.options.map((option, index) => {
            return this.renderSwitch(option, index);
          })}
        </FieldGroup>
      </GlobalForm.Errorable>
    );
  }
}

export default setter(FormSwitchArray);
