import React, { Component } from "react";
import PropTypes from "prop-types";
import setter from "./setter";
import classNames from "classnames";

class FormRadios extends Component {
  static displayName = "Form.Radios";

  static propTypes = {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.any.isRequired,
        label: PropTypes.string.isRequired,
        className: PropTypes.string
      })
    ).isRequired,
    label: PropTypes.string,
    value: PropTypes.any,
    set: PropTypes.func,
    toggleIcon: PropTypes.string
  };

  render() {
    return (
      <div className="form-input">
        {this.props.label
          ? <label>
              {this.props.label}
            </label>
          : null}
        {this.props.options.map(option => {
          const checked = this.props.value === option.value;
          const optionalClass = option.className ? option.className : "";
          const inputClassNames = classNames(
            "form-toggle",
            "radio",
            optionalClass,
            { checked }
          );
          const iconClassNames = classNames("manicon", this.props.toggleIcon);
          return (
            <label
              htmlFor={option.value}
              className={inputClassNames}
              key={option.value}
            >
              <input
                type="radio"
                value={option.value}
                id={option.value}
                checked={checked}
                onChange={() => {
                  this.props.set(option.value);
                }}
              />
              <span className="toggle-indicator">
                {checked ? <i className={iconClassNames} /> : null}
              </span>
              <span className="toggle-label">
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    );
  }
}

export default setter(FormRadios);
