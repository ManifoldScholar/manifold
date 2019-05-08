import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import setter from "./setter";

class FormCheckboxes extends Component {
  static displayName = "Form.Checkboxes";

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
        {this.props.label ? (
          <h4 className="form-input-heading" style={{ marginBottom: "1.5em" }}>
            {this.props.label}
          </h4>
        ) : null}
        {this.props.options.map(option => {
          const checked = this.props.value === option.value;
          const optionalClass = option.className ? option.className : "";
          const inputClassNames = classNames(
            "form-toggle",
            "checkbox",
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
                type="checkbox"
                value={option.value}
                id={option.value}
                checked={checked}
                onClick={() => {
                  if (checked) {
                    this.props.set(null);
                  } else {
                    this.props.set(option.value);
                  }
                }}
              />
              <span className="toggle-indicator" aria-hidden="true">
                {checked ? <i className={iconClassNames} /> : null}
              </span>
              <span className="toggle-label">{option.label}</span>
            </label>
          );
        })}
      </div>
    );
  }
}

export default setter(FormCheckboxes);
