import React, { Component } from "react";
import PropTypes from "prop-types";
import setter from "./setter";
import { Form as GlobalForm } from "components/global";
import classnames from "classnames";
import isString from "lodash/isString";
import Instructions from "./Instructions";

class FormBaseInput extends Component {
  static displayName = "Form.BaseInput";

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
    inputType: PropTypes.string,
    inputClasses: PropTypes.string,
    join: PropTypes.func,
    id: PropTypes.string,
    idForError: PropTypes.string,
    renderValue: PropTypes.func,
    wide: PropTypes.bool
  };

  componentDidMount() {
    if (this.props.focusOnMount === true && this.inputElement) {
      this.inputElement.focus();
    }
  }

  renderValue(props) {
    if (!props.renderValue) return props.value;
    return props.renderValue(props.value);
  }

  render() {
    const labelClass = classnames({
      "has-instructions": isString(this.props.instructions)
    });
    const inputClasses = classnames(this.props.inputClasses, {
      "form-input": true,
      wide: this.props.wide
    });

    return (
      <GlobalForm.Errorable
        className={inputClasses}
        name={this.props.name}
        errors={this.props.errors}
        label={this.props.label}
        idForError={this.props.idForError}
      >
        <label htmlFor={this.props.id} className={labelClass}>
          {this.props.label}
        </label>
        <input
          ref={input => {
            this.inputElement = input;
          }}
          id={this.props.id}
          type={this.props.inputType}
          placeholder={this.props.placeholder}
          onChange={this.props.onChange}
          value={this.renderValue(this.props)}
          aria-describedby={this.props.idForError}
        />
        <Instructions instructions={this.props.instructions} />
      </GlobalForm.Errorable>
    );
  }
}

export default setter(FormBaseInput);
