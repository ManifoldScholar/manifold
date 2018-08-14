import React, { Component } from "react";
import PropTypes from "prop-types";
import setter from "./setter";
import { Form as GlobalForm } from "components/global";
import classnames from "classnames";
import isString from "lodash/isString";
import isArray from "lodash/isArray";
import uniqueId from "lodash/uniqueId";
import Instructions from "./Instructions";

class FormTextInput extends Component {
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
    id: uniqueId("text-input-"),
    idForError: uniqueId("text-input-error-")
  };

  componentDidMount() {
    if (this.props.focusOnMount === true && this.inputElement) {
      this.inputElement.focus();
    }
  }

  renderValue(value) {
    if (!value) return "";
    if (!isArray(value)) return value;
    return this.props.join(value);
  }

  render() {
    const labelClass = classnames({
      "has-instructions": isString(this.props.instructions)
    });
    const inputClasses = classnames({
      "form-input": true,
      wide: this.props.wide
    });
    const inputType = this.props.password ? "password" : "text";
    const id = this.props.name
      ? this.props.name + "-" + this.props.id
      : this.props.id;
    const errorId = this.props.name
      ? this.props.name + "-" + this.props.id
      : this.props.id;

    return (
      <GlobalForm.Errorable
        className={inputClasses}
        name={this.props.name}
        errors={this.props.errors}
        label={this.props.label}
        idForError={errorId}
      >
        <label htmlFor={id} className={labelClass}>
          {this.props.label}
        </label>
        <input
          ref={input => {
            this.inputElement = input;
          }}
          id={id}
          type={inputType}
          placeholder={this.props.placeholder}
          onChange={this.props.onChange}
          value={this.renderValue(this.props.value)}
          aria-describedby={errorId}
        />
        <Instructions instructions={this.props.instructions} />
      </GlobalForm.Errorable>
    );
  }
}

export default setter(FormTextInput);
