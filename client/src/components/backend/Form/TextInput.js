import React, { Component } from "react";
import PropTypes from "prop-types";
import setter from "./setter";
import { Form as GlobalForm } from "components/global";
import classnames from "classnames";
import isString from "lodash/isString";
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
    join: PropTypes.func
  };

  static defaultProps = {
    focusOnMount: false,
    password: false,
    join: array => array.join(", ")
  };

  componentDidMount() {
    this.id = uniqueId("text-input-");

    if (this.props.focusOnMount === true && this.inputElement) {
      this.inputElement.focus();
    }
  }

  renderValue(value) {
    if (!value) return "";
    if (isString(value)) return value;
    return this.props.join(value);
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
        <label htmlFor={this.id} className={labelClass}>
          {this.props.label}
        </label>
        <Instructions instructions={this.props.instructions} />
        <input
          ref={input => {
            this.inputElement = input;
          }}
          id={this.id}
          type={inputType}
          placeholder={this.props.placeholder}
          onChange={this.props.onChange}
          value={this.renderValue(this.props.value)}
        />
      </GlobalForm.Errorable>
    );
  }
}

export default setter(FormTextInput);
