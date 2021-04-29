import React, { Component } from "react";
import PropTypes from "prop-types";
import { UID } from "react-uid";
import Errorable from "global/components/form/Errorable";
import Instructions from "./Instructions";
import withFormOptions from "hoc/with-form-options";
import IconComposer from "global/components/utility/IconComposer";
import classNames from "classnames";

class FormSelect extends Component {
  static displayName = "Form.Select";

  static propTypes = {
    value: PropTypes.any,
    errors: PropTypes.array,
    label: PropTypes.string,
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    rounded: PropTypes.bool,
    name: PropTypes.string,
    wide: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.any.isRequired,
        label: PropTypes.string.isRequired,
        key: PropTypes.string.isRequired
      })
    ).isRequired,
    focusOnMount: PropTypes.bool
  };

  static defaultProps = {
    rounded: false
  };

  componentDidMount() {
    if (this.props.focusOnMount === true && this.inputElement) {
      this.inputElement.focus();
    }
  }

  get idPrefix() {
    return "select";
  }

  get idForErrorPrefix() {
    return "select-error";
  }

  get idForInstructionsPrefix() {
    return "select-instructions";
  }

  render() {
    const options = this.props.options.map(option => {
      return (
        <option key={option.key} value={option.value}>
          {option.label}
        </option>
      );
    });

    const selectClassName = classNames({
      "form-select": true,
      "form-select--rounded": this.props.rounded
    });

    const wrapperClassName = classNames({
      "form-input": true,
      wide: this.props.wide
    });

    const labelClassName = classNames({
      "pad-bottom": this.props.rounded
    });

    return (
      <UID>
        {id => (
          <div className={wrapperClassName}>
            <Errorable
              className={selectClassName}
              name={this.props.name}
              errors={this.props.errors}
              label={this.props.label}
              idForError={`${this.idForErrorPrefix}-${id}`}
            >
              <label
                htmlFor={`${this.idPrefix}-${id}`}
                className={labelClassName}
              >
                {this.props.label}
              </label>
              <div className="form-select">
                <IconComposer
                  icon="disclosureDown24"
                  size={24}
                  iconClass="form-select__icon"
                />
                <select
                  id={`${this.idPrefix}-${id}`}
                  aria-describedby={`${this.idForErrorPrefix}-${id} ${this.idForInstructionsPrefix}-${id}`}
                  onChange={this.props.onChange}
                  value={this.props.optionsMeta.stringValue}
                  ref={input => {
                    this.inputElement = input;
                  }}
                >
                  {options}
                </select>
              </div>
              <Instructions
                instructions={this.props.instructions}
                id={`${this.idForInstructionsPrefix}-${id}`}
              />
            </Errorable>
          </div>
        )}
      </UID>
    );
  }
}

export default withFormOptions(FormSelect);
