import React, { Component } from "react";
import PropTypes from "prop-types";
import GlobalForm from "global/components/form";
import Option from "./Radio/Option";
import classnames from "classnames";
import labelId from "helpers/labelId";
import isString from "lodash/isString";
import Instructions from "./Instructions";
import withFormOptions from "hoc/with-form-options";

class FormRadios extends Component {
  static displayName = "Form.Radios";

  static propTypes = {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.any.isRequired,
        label: PropTypes.string.isRequired
      })
    ).isRequired,
    label: PropTypes.string,
    inline: PropTypes.bool,
    name: PropTypes.string,
    value: PropTypes.any,
    set: PropTypes.func,
    id: PropTypes.string,
    idForError: PropTypes.string,
    inputClasses: PropTypes.string,
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    focusOnMount: PropTypes.bool
  };

  static defaultProps = {
    focusOnMount: false,
    id: labelId("radios-"),
    idForError: labelId("radios-error-")
  };

  get options() {
    return this.props.options;
  }

  get optionProps() {
    return {
      inline: this.props.inline,
      onChange: this.props.onChange,
      value: this.props.value
    };
  }

  get labelClass() {
    return classnames({
      "has-instructions": isString(this.props.instructions)
    });
  }

  get inputClasses() {
    return classnames(this.props.inputClasses, {
      "form-input": true,
      wide: this.props.wide
    });
  }

  render() {
    return (
      <GlobalForm.Errorable
        className={this.inputClasses}
        name={this.props.name}
        errors={this.props.errors}
        label={this.props.label}
        idForError={this.props.idForError}
      >
        <label htmlFor={this.props.id} className={this.labelClass}>
          {this.props.label}
        </label>
        <Instructions instructions={this.props.instructions} />
        {this.options.map(option => (
          <Option
            key={`${this.props.id}-${option.internalValue}`}
            option={option}
            {...this.optionProps}
          />
        ))}
      </GlobalForm.Errorable>
    );
  }
}

export default withFormOptions(FormRadios);
