import React, { Component } from "react";
import PropTypes from "prop-types";
import isArray from "lodash/isArray";
import BaseInput from "./BaseInput";
import labelId from "helpers/labelId";

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
    id: PropTypes.string,
    idForError: PropTypes.string,
    wide: PropTypes.bool
  };

  static defaultProps = {
    focusOnMount: false,
    password: false,
    join: array => array.join(", "),
    id: labelId("text-input-"),
    idForError: labelId("text-input-error-")
  };

  renderValue = value => {
    if (!value) return "";
    if (!isArray(value)) return value;
    return this.props.join(value);
  };

  render() {
    const inputType = this.props.password ? "password" : "text";
    const id = this.props.name
      ? this.props.name + "-" + this.props.id
      : this.props.id;
    const errorId = this.props.name
      ? this.props.name + "-" + this.props.id
      : this.props.id;

    return (
      <BaseInput
        {...this.props}
        id={id}
        idForError={errorId}
        inputType={inputType}
        renderValue={this.renderValue}
      />
    );
  }
}
