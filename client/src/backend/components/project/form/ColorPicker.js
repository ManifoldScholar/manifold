import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { UIDConsumer } from "react-uid";
import IconComposer from "global/components/utility/IconComposer";

export default class ColorPicker extends Component {
  static displayName = "Project.Form.ColorPicker";

  static propTypes = {
    onChange: PropTypes.func,
    wrapperClass: PropTypes.string,
    getModelValue: PropTypes.func,
    label: PropTypes.string
  };

  static defaultProps = {
    label: "Background Color Picker"
  };

  get idForPrefix() {
    return "color-picker";
  }

  renderColorPalette() {
    const avatarColors = [
      {
        value: "primary",
        label: "Green",
        className: "color-picker__item--primary"
      },
      {
        value: "secondary",
        label: "Gray",
        className: "color-picker__item--secondary"
      },
      {
        value: "tertiary",
        label: "Blue",
        className: "color-picker__item--tertiary"
      },
      {
        value: "quaternary",
        label: "Orange",
        className: "color-picker__item--quaternary"
      },
      {
        value: "quinary",
        label: "Violet",
        className: "color-picker__item--quinary"
      },
      {
        value: "sentary",
        label: "White",
        className: "color-picker__item--sentary"
      }
    ];

    return (
      <UIDConsumer name={id => `${this.idForPrefix}-${id}`}>
        {id => (
          <div
            className="color-picker__list"
            role="group"
            aria-label={this.props.label}
          >
            {avatarColors.map(color => {
              const checked =
                this.props.getModelValue("attributes[avatarColor]") ===
                color.value;
              const colorClass = color.className ? color.className : "";
              const inputClassNames = classNames(
                "color-picker__item",
                "radio",
                colorClass,
                { checked }
              );
              return (
                <label
                  htmlFor={`${id}-${color.value}`}
                  className={inputClassNames}
                  key={color.value}
                >
                  <span className="screen-reader-text">{color.label}</span>
                  <input
                    type="radio"
                    value={color.value}
                    id={`${id}-${color.value}`}
                    name={id}
                    checked={checked}
                    onChange={() => this.props.onChange(color)}
                    className="color-picker__input"
                  />
                  <span className="color-picker__indicator" aria-hidden="true">
                    {checked && (
                      <IconComposer
                        icon="checkmark16"
                        size={18.5}
                        className="color-picker__indicator-icon"
                      />
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </UIDConsumer>
    );
  }

  render() {
    return (
      <div className="color-picker">
        <div className="color-picker__inner">{this.renderColorPalette()}</div>
        <div className="color-picker__description" aria-hidden="true">
          Select A Different Background Color
        </div>
      </div>
    );
  }
}
