import React, { Component } from "react";
import PropTypes from "prop-types";
import setter from "./setter";
import { Form as GlobalForm } from "components/global";
import classnames from "classnames";
import isString from "lodash/isString";
import Instructions from "./Instructions";

class FormTextInput extends Component {
  static displayName = "Form.TextInput";

  static propTypes = {
    placeholder: PropTypes.string,
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
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

  componentDidMount() {
    if (this.props.focusOnMount === true && this.inputElement)
      this.inputElement.focus();
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
        <Instructions instructions={this.props.instructions} />
        <input
          ref={input => {
            this.inputElement = input;
          }}
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
