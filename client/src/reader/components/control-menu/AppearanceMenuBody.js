import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";
import withScreenReaderStatus from "hoc/with-screen-reader-status";

class AppearanceMenuBody extends Component {
  static displayName = "ControlMenu.AppearanceMenuBody";

  static propTypes = {
    appearance: PropTypes.object,
    selectFont: PropTypes.func,
    setColorScheme: PropTypes.func,
    incrementFontSize: PropTypes.func,
    decrementFontSize: PropTypes.func,
    incrementMargins: PropTypes.func,
    decrementMargins: PropTypes.func,
    resetTypography: PropTypes.func
  };

  handleFontStyleControl = event => {
    this.props.selectFont(event.target.value);
    this.props.setScreenReaderStatus(
      this.resetOptionMessage("font", event.target.value)
    );
  };

  handleColorSchemeControl = event => {
    this.props.setColorScheme(event.target.value);
    this.props.setScreenReaderStatus(
      this.resetOptionMessage("color scheme", event.target.value)
    );
  };

  incrementSizeHandler = (event, enabled) => {
    event.stopPropagation();
    if (enabled) {
      this.props.incrementFontSize();
      this.props.setScreenReaderStatus(this.incrementFontMessage);
    }
  };

  decrementSizeHandler = (event, enabled) => {
    event.stopPropagation();
    if (enabled) {
      this.props.decrementFontSize();
      this.props.setScreenReaderStatus(this.decrementFontMessage);
    }
  };

  resetHandler = event => {
    event.stopPropagation();
    this.props.setColorScheme("light");
    this.props.resetTypography();
    this.props.setScreenReaderStatus(this.resetMessage);
  };

  incrementMarginsHandler = event => {
    event.stopPropagation();
    this.props.incrementMargins();
    this.props.setScreenReaderStatus(this.incrementMarginsMessage);
  };

  decrementMarginsHandler = event => {
    event.stopPropagation();
    this.props.decrementMargins();
    this.props.setScreenReaderStatus(this.decrementMarginsMessage);
  };

  resetOptionMessage(appearanceType, option) {
    return `Reader ${appearanceType} is set to ${option}.`;
  }

  get incrementMarginsMessage() {
    const baseMessage = "Reader margins increased";
    const appendedMessage = this.marginIncreaseable ? "." : " to maximum size.";
    return baseMessage + appendedMessage;
  }

  get decrementMarginsMessage() {
    const baseMessage = "Reader margins decreased";
    const appendedMessage = this.marginDecreasable ? "." : " to minimum size.";
    return baseMessage + appendedMessage;
  }

  get incrementFontMessage() {
    const baseMessage = "Reader font size increased";
    const appendedMessage =
      this.fontSize.current < this.fontSize.max ? "." : " to maximum size.";
    return baseMessage + appendedMessage;
  }

  get decrementFontMessage() {
    const baseMessage = "Reader font size decreased";
    const appendedMessage =
      this.fontSize.current > this.fontSize.min ? "." : " to minimum size.";
    return baseMessage + appendedMessage;
  }

  get resetMessage() {
    return "Reader color scheme and typography reset to default settings.";
  }

  get typography() {
    return this.props.appearance.typography;
  }

  get fontSize() {
    return this.props.appearance.typography.fontSize;
  }

  get colorScheme() {
    return this.props.appearance.colors.colorScheme;
  }

  get sansDisabled() {
    return this.typography.font !== "sans-serif";
  }

  get serifDisabled() {
    return this.typography.font !== "serif";
  }

  get fontSizeDecreasable() {
    return this.fontSize.current > this.fontSize.min;
  }

  get fontSizeIncreasable() {
    return this.fontSize.current < this.fontSize.max;
  }

  get resetDisabled() {
    return (
      this.typography.font === "serif" &&
      this.fontSize.current === 3 &&
      this.typography.margins.current === 1 &&
      this.colorScheme === "light"
    );
  }

  get marginIncreaseable() {
    return this.typography.margins.current < this.typography.margins.max;
  }

  get marginDecreasable() {
    return this.typography.margins.current > this.typography.margins.min;
  }

  get lightSchemeButtonClassNames() {
    return classNames({
      "appearance-menu__color-scheme": true,
      "appearance-menu__color-scheme--light": true,
      "appearance-menu__color-scheme--active": this.colorScheme === "light",
      "appearance-menu__button-base": true
    });
  }

  get darkSchemeButtonClassNames() {
    return classNames({
      "appearance-menu__color-scheme": true,
      "appearance-menu__color-scheme--dark": true,
      "appearance-menu__color-scheme--active": this.colorScheme === "dark",
      "appearance-menu__button-base": true
    });
  }

  get fontStyleOptions() {
    return [
      {
        label: "Serif",
        value: "serif"
      },
      {
        label: "Sans-serif",
        value: "sans-serif"
      }
    ];
  }

  get colorSchemeOptions() {
    return [
      {
        label: "Light",
        value: "light"
      },
      {
        label: "Dark",
        value: "dark"
      }
    ];
  }

  renderFontStyleControl() {
    const labelClassName = option =>
      classNames({
        "appearance-menu__button-base": true,
        "appearance-menu__font-style": true,
        [`appearance-menu__font-style--${option.value}`]: true,
        "appearance-menu__font-style--active":
          this.typography.font === option.value
      });

    return (
      <fieldset className="appearance-menu__radio-group">
        <legend className="screen-reader-text">
          Select font style for reader
        </legend>
        <div className="appearance-menu__radio-stack">
          {this.fontStyleOptions.map((option, index) => (
            <label key={option.value} className={labelClassName(option)}>
              <input
                value={option.value}
                name="font-style-radios"
                type="radio"
                checked={option.value === this.typography.font}
                onChange={this.handleFontStyleControl}
                className="appearance-menu__radio-input"
                tabIndex={index === 0 ? 0 : -1}
              />
              <span className="appearance-menu__radio-label">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  renderColorSchemeControl() {
    const labelClassName = option =>
      classNames({
        "appearance-menu__button-base": true,
        "appearance-menu__color-scheme": true,
        [`appearance-menu__color-scheme--${option.value}`]: true,
        "appearance-menu__color-scheme--active":
          this.colorScheme === option.value
      });

    return (
      <fieldset className="appearance-menu__radio-group">
        <legend className="screen-reader-text">
          Select color scheme for reader
        </legend>
        {this.colorSchemeOptions.map((option, index) => (
          <label key={option.value} className={labelClassName(option)}>
            <input
              value={option.value}
              name="color-scheme-radios"
              type="radio"
              checked={option.value === this.colorScheme}
              onChange={this.handleColorSchemeControl}
              className="appearance-menu__radio-input"
              tabIndex={index === 0 ? 0 : -1}
            />
            <Utility.IconComposer
              icon="CheckUnique"
              size={30}
              iconClass="appearance-menu__color-scheme-icon"
            />
            <span className="screen-reader-text">{option.label}</span>
          </label>
        ))}
      </fieldset>
    );
  }

  renderFontControls() {
    const fontSizeButtonClass = classNames(
      "appearance-menu__font-size-button",
      "appearance-menu__primary-hover-button",
      "appearance-menu__button-base"
    );

    return (
      <li className="appearance-menu__section control-menu__section">
        <div className="appearance-menu__font-control-group">
          <div className="appearance-menu__font-style-control">
            {this.renderFontStyleControl()}
          </div>
          <div className="appearance-menu__font-size-control appearance-menu__font-size-control--serif">
            <div role="group" aria-label="Adjust font size">
              <button
                className={fontSizeButtonClass}
                disabled={this.serifDisabled}
                aria-disabled={!this.fontSizeDecreasable}
                onClick={event => {
                  this.decrementSizeHandler(event, this.fontSizeDecreasable);
                }}
              >
                <Utility.IconComposer icon="MinusUnique" size={30} />
                <span className="screen-reader-text">
                  {"Decrease font size"}
                </span>
              </button>
              <button
                className={fontSizeButtonClass}
                disabled={this.serifDisabled}
                aria-disabled={!this.fontSizeIncreasable}
                onClick={event => {
                  this.incrementSizeHandler(event, this.fontSizeIncreasable);
                }}
              >
                <Utility.IconComposer icon="PlusUnique" size={30} />
                <span className="screen-reader-text">
                  {"Increase font size"}
                </span>
              </button>
            </div>
          </div>
          <div className="appearance-menu__font-size-control appearance-menu__font-size-control--sans">
            <div>
              <button
                className={fontSizeButtonClass}
                disabled={this.sansDisabled}
                aria-disabled={!this.fontSizeDecreasable}
                onClick={event => {
                  this.decrementSizeHandler(event, this.fontSizeDecreasable);
                }}
              >
                <Utility.IconComposer icon="MinusUnique" size={30} />
                <span className="screen-reader-text">
                  {"Decrease font size"}
                </span>
              </button>
              <button
                className={fontSizeButtonClass}
                disabled={this.sansDisabled}
                aria-disabled={!this.fontSizeIncreasable}
                onClick={event => {
                  this.incrementSizeHandler(event, this.fontSizeIncreasable);
                }}
              >
                <Utility.IconComposer icon="PlusUnique" size={30} />
                <span className="screen-reader-text">
                  {"Increase font size"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </li>
    );
  }

  renderColorSchemeControls() {
    return (
      <li className="appearance-menu__section control-menu__section">
        <div className="appearance-menu__color-buttons-container">
          {this.renderColorSchemeControl()}
        </div>
      </li>
    );
  }

  renderMarginControls() {
    const buttonClass = classNames(
      "appearance-menu__margin-button",
      "appearance-menu__button-base",
      "appearance-menu__primary-hover-button"
    );

    return (
      <li className="appearance-menu__section control-menu__section">
        <div
          role="group"
          aria-label="Adjust text margins"
          className="appearance-menu__control-margins"
        >
          <button
            className={buttonClass}
            aria-disabled={!this.marginIncreaseable}
            onClick={this.incrementMarginsHandler}
          >
            <Utility.IconComposer
              icon="MarginIncreaseUnique"
              iconClass="appearance-menu__menu-icon"
            />
            <span className="screen-reader-text">
              {"Increase text margins"}
            </span>
          </button>
          <button
            className={buttonClass}
            aria-disabled={!this.marginDecreasable}
            onClick={this.decrementMarginsHandler}
          >
            <Utility.IconComposer
              icon="MarginDecreaseUnique"
              iconClass="appearance-menu__menu-icon"
            />
            <span className="screen-reader-text">
              {"Decrease text margins"}
            </span>
          </button>
        </div>
      </li>
    );
  }

  render() {
    return (
      <div className="appearance-menu control-menu">
        <div className="control-menu__header">
          <div className="control-menu__heading">{"Adjust appearance:"}</div>
        </div>
        <ul className="appearance-menu__list">
          {this.renderFontControls()}
          {this.renderColorSchemeControls()}
          {this.renderMarginControls()}
        </ul>
        <div>
          <button
            className="control-menu__button"
            disabled={this.resetDisabled}
            onClick={this.resetHandler}
          >
            <Utility.IconComposer
              icon="reload24"
              size={32}
              iconClass="appearance-menu__reload-icon"
            />
            <span>{"Reset to Defaults"}</span>
          </button>
        </div>
      </div>
    );
  }
}

export default withScreenReaderStatus(AppearanceMenuBody);
