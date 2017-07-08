import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class ColorPicker extends Component {
  static displayName = "Project.Form.ColorPicker";

  static propTypes = {
    onChange: PropTypes.func,
    getModelValue: PropTypes.func
  };

  renderColorPalette() {
    const avatarColors = [
      { value: "primary", label: "", className: "primary" },
      { value: "secondary", label: "", className: "secondary" },
      { value: "tertiary", label: "", className: "tertiary" },
      { value: "quaternary", label: "", className: "quaternary" },
      { value: "quinary", label: "", className: "quinary" },
      { value: "sentary", label: "", className: "sentary" }
    ];

    return (
      <div className="form-input">
        {avatarColors.map(color => {
          const checked =
            this.props.getModelValue("attributes[avatarColor]") === color.value;
          const colorClass = color.className ? color.className : "";
          const inputClassNames = classNames(
            "form-toggle",
            "radio",
            colorClass,
            { checked }
          );
          return (
            <label
              htmlFor={color.value}
              className={inputClassNames}
              key={color.value}
            >
              <input
                type="radio"
                value={color.value}
                id={color.value}
                checked={checked}
                onChange={() => this.props.onChange(color)}
              />
              <span className="toggle-indicator">
                {checked ? <i className="manicon manicon-check" /> : null}
              </span>
              <span className="toggle-label">
                {color.label}
              </span>
            </label>
          );
        })}
      </div>
    );
  }

  render() {
    return (
      <div className="color-picker">
        <div className="colors">
          {this.renderColorPalette()}
        </div>
        <div className="default-description">
          Select A Different<br />Background Color
        </div>
      </div>
    );
  }
}
