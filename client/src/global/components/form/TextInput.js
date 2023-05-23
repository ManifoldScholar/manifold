import React, { Component } from "react";
import PropTypes from "prop-types";
import isArray from "lodash/isArray";
import { UIDConsumer } from "react-uid";
import BaseInput from "./BaseInput";

export default class FormTextInput extends Component {
  static displayName = "Form.TextInput";

  static propTypes = {
    placeholder: PropTypes.string,
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    label: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    afterChange: PropTypes.func,
    value: PropTypes.any,
    focusOnMount: PropTypes.bool,
    errors: PropTypes.array,
    password: PropTypes.bool,
    join: PropTypes.func,
    wide: PropTypes.bool,
    disabled: PropTypes.bool,
    buttons: PropTypes.array
  };

  static defaultProps = {
    focusOnMount: false,
    password: false,
    join: array => array.join(", ")
  };

  get idPrefix() {
    return "text-input";
  }

  get idForErrorPrefix() {
    return "text-input-error";
  }

  get idForInstructionsPrefix() {
    return "text-input-instructions";
  }

  renderValue = value => {
    if (!value) return "";
    if (!isArray(value)) return value;
    return this.props.join(value);
  };

  render() {
    const inputType =
      this.props.inputType ?? (this.props.password ? "password" : "text");

    return (
      <UIDConsumer>
        {id => (
          <BaseInput
            id={`${this.idPrefix}-${id}`}
            idForError={`${this.idForErrorPrefix}-${id}`}
            idForInstructions={`${this.idForInstructionsPrefix}-${id}`}
            inputType={inputType}
            renderValue={this.renderValue}
            {...this.props}
          />
        )}
      </UIDConsumer>
    );
  }
}
