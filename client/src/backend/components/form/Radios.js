import React, { Component } from "react";
import PropTypes from "prop-types";
import GlobalForm from "global/components/form";
import Option from "./Radio/Option";
import RadioLabel from "./Radio/Label";
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
    prompt: PropTypes.string,
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

  get focusOnMount() {
    return this.props.focusOnMount;
  }

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

  get inputClasses() {
    return classnames(this.props.inputClasses, {
      "form-input": true,
      "form-input-radios": true,
      "extra-space-bottom": true,
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
        <RadioLabel
          id={this.props.id}
          label={this.props.label}
          prompt={this.props.prompt}
          hasInstructions={isString(this.props.instructions)}
        />
        <Instructions instructions={this.props.instructions} />
        {this.options.map((option, index) => (
          <Option
            key={`${this.props.id}-${option.internalValue}`}
            option={option}
            focusOnMount={this.focusOnMount && index === 0}
            {...this.optionProps}
          />
        ))}
      </GlobalForm.Errorable>
    );
  }
}

export default withFormOptions(FormRadios);
