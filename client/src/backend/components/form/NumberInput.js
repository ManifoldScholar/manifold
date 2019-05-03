import React, { Component } from "react";
import PropTypes from "prop-types";
import labelId from "helpers/labelId";
import isNull from "lodash/isNull";
import isUndefined from "lodash/isUndefined";
import BaseInput from "./BaseInput";

export default class FormNumberInput extends Component {
  static defaultProps = {
    focusOnMount: false,
    id: labelId("text-input-"),
    idForError: labelId("text-input-error-")
  };

  static displayName = "Form.NumberInput";

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
    id: PropTypes.string,
    idForError: PropTypes.string,
    wide: PropTypes.bool
  };

  renderValue = value => {
    if (isNull(value) || isUndefined(value)) return "";
    return value;
  };

  render() {
    const id = this.props.name
      ? this.props.name + "-" + this.props.id
      : this.props.id;
    const errorId = this.props.name
      ? this.props.name + "-" + this.props.id
      : this.props.id;

    return (
      <BaseInput
        {...this.props}
        inputClasses="form-number-input"
        id={id}
        idForError={errorId}
        inputType="number"
        renderValue={this.renderValue}
      />
    );
  }
}
