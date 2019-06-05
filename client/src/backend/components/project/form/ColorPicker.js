import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";

export default class ColorPicker extends Component {
  static displayName = "Project.Form.ColorPicker";

  static propTypes = {
    onChange: PropTypes.func,
    wrapperClass: PropTypes.string,
    getModelValue: PropTypes.func
  };

  renderColorPalette() {
    const avatarColors = [
      {
        value: "primary",
        label: "Primary Background Color",
        className: "primary"
      },
      {
        value: "secondary",
        label: "Secondary Background Color",
        className: "secondary"
      },
      {
        value: "tertiary",
        label: "Tertiary Background Color",
        className: "tertiary"
      },
      {
        value: "quaternary",
        label: "Quaternary Background Color",
        className: "quaternary"
      },
      {
        value: "quinary",
        label: "Quinary Background Color",
        className: "quinary"
      },
      {
        value: "sentary",
        label: "Sentary Background Color",
        className: "sentary"
      }
    ];

    return (
      <div className="wrapper">
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
              <span className="screen-reader-text">{color.label}</span>
              <input
                type="radio"
                value={color.value}
                id={color.value}
                checked={checked}
                onChange={() => this.props.onChange(color)}
              />
              <span className="toggle-indicator" aria-hidden="true">
                {checked && (
                  <IconComposer
                    icon="checkmark16"
                    size={18.5}
                    iconClass="toggle-indicator__icon"
                  />
                )}
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
        <div className="colors">{this.renderColorPalette()}</div>
        <div className="default-description" aria-hidden="true">
          Select A Different Background Color
        </div>
      </div>
    );
  }
}
