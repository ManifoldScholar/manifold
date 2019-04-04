import React, { Component } from "react";
import PropTypes from "prop-types";
import labelId from "helpers/labelId";
import GlobalForm from "global/components/form";
import Instructions from "./Instructions";
import withFormOptions from "hoc/with-form-options";
import IconComposer from "global/components/utility/IconComposer";

class FormSelect extends Component {
  static displayName = "Form.Select";

  static propTypes = {
    value: PropTypes.any,
    errors: PropTypes.array,
    label: PropTypes.string,
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    name: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.any.isRequired,
        label: PropTypes.string.isRequired,
        internalValue: PropTypes.any.isRequired
      })
    ).isRequired,
    focusOnMount: PropTypes.bool,
    id: PropTypes.string,
    idForError: PropTypes.string
  };

  static defaultProps = {
    id: labelId("select-"),
    idForError: labelId("select-error-")
  };

  componentDidMount() {
    if (this.props.focusOnMount === true && this.inputElement) {
      this.inputElement.focus();
    }
  }

  render() {
    const options = this.props.options.map(option => {
      return (
        <option key={option.internalValue} value={option.internalValue}>
          {option.label}
        </option>
      );
    });

    return (
      <div className="form-input">
        <GlobalForm.Errorable
          className="form-input"
          name={this.props.name}
          errors={this.props.errors}
          label={this.props.label}
          idForError={this.props.idForError}
        >
          <label htmlFor={this.id}>{this.props.label}</label>
          <div className="form-select">
            <IconComposer
              icon="disclosureDown16"
              size={20}
              iconClass="form-select__icon"
            />
            <select
              id={this.id}
              aria-describedby={this.props.idForError}
              onChange={this.props.onChange}
              value={this.props.value}
              ref={input => {
                this.inputElement = input;
              }}
            >
              {options}
            </select>
          </div>
          <Instructions instructions={this.props.instructions} />
        </GlobalForm.Errorable>
      </div>
    );
  }
}

export default withFormOptions(FormSelect);
