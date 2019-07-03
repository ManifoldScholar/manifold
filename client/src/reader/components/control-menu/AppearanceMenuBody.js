import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";
import withScreenReaderStatus from "hoc/with-screen-reader-status";

export class AppearanceMenuBody extends Component {
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
  }

  incrementSizeHandler = (event, enabled) => {
    event.stopPropagation();
    if (enabled) {
      this.props.incrementFontSize();
      this.props.setScreenReaderStatus(this.incrementFontMessage);
    };
  };

  decrementSizeHandler = (event, enabled) => {
    event.stopPropagation();
    if (enabled) {
      this.props.decrementFontSize();
      this.props.setScreenReaderStatus(this.decrementFontMessage);
    };
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
    const appendedMessage = this.fontSize.current < this.fontSize.max
    ? "."
    : " to maximum size.";
    return baseMessage + appendedMessage;
  }

  get decrementFontMessage() {
    const baseMessage = "Reader font size decreased";
    const appendedMessage = this.fontSize.current > this.fontSize.min
    ? "."
    : " to minimum size.";
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
    return this.typography.font === "serif"
    && this.fontSize.current === 3
    && this.typography.margins.current === 1
    && this.colorScheme === "light";
  }

  get marginIncreaseable() {
    return this.typography.margins.current < this.typography.margins.max;
  }

  get marginDecreasable() {
    return this.typography.margins.current > this.typography.margins.min;
  }

  get containerClassNames() {
    return "appearance-menu";
  }

  get headerClassNames() {
    return "appearance-menu__header";
  }

  get headingClassNames() {
    return "appearance-menu__heading";
  }

  get sectionClassNames() {
    return "appearance-menu__section";
  }

  get listClassNames() {
    return "appearance-menu__list";
  }

  get controlFontWrapperClassNames() {
    return "appearance-menu__font-control-group";
  }

  get controlFontStyleClassNames() {
    return "appearance-menu__font-style-control";
  }

  get controlFontClassNames() {
    return "appearance-menu__font-size-control";
  }

  get fontSizeButtonClassNames() {
    return classNames({
      "appearance-menu__font-size-button": true,
      "appearance-menu__primary-hover-button": true,
      "appearance-menu__button-base": true
    })
  }

  get screenReaderTextClassNames() {
    return "screen-reader-text";
  }

  get colorButtonContainerClassNames() {
    return "appearance-menu__color-buttons-container";
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

  get controlMarginsClassNames() {
    return "appearance-menu__control-margins";
  }

  get marginButtonClassNames() {
    return classNames({
      "appearance-menu__margin-button": true,
      "appearance-menu__button-base": true,
      "appearance-menu__primary-hover-button": true
    })
  }

  get resetButtonClassNames() {
    return classNames({
      "appearance-menu__reset-button": true,
      "appearance-menu__primary-hover-button": true,
      "appearance-menu__button-base": true,
    })
  }

  get marginIconClassNames() {
    return "appearance-menu__menu-icon"
  }

  get reloadIconClassNames() {
    return "appearance-menu__reload-icon"
  }

  get fontStyleOptions() {
    return [
      {
        label: "Serif",
        value: "serif"
      }, {
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
      }, {
        label: "Dark",
        value: "dark"
      }
    ];
  }

  get fontStyleControlName() {
    return "font-style-radios";
  }

  get colorSchemeControlName() {
    return "color-scheme-radios";
  }

  renderFontStyleControl() {
    const labelClassName = option => classNames({
      "appearance-menu__button-base": true,
      "appearance-menu__font-style": true,
      [`appearance-menu__font-style--${option.value}`]: true,
      "appearance-menu__font-style--active": this.typography.font === option.value
    });

    return (
      <fieldset className="appearance-menu__radio-group">
        <legend className="screen-reader-text">
          Select font style for reader
        </legend>
        <div className="appearance-menu__radio-stack">
          {this.fontStyleOptions.map(option => (
            <label key={option.value} className={labelClassName(option)}>
              <input
                value={option.value}
                name={this.fontStyleControlName}
                type="radio"
                checked={option.value === this.typography.font}
                onChange={this.handleFontStyleControl}
                className="appearance-menu__radio-input"
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
    const labelClassName = option => classNames({
      "appearance-menu__button-base": true,
      "appearance-menu__color-scheme": true,
      [`appearance-menu__color-scheme--${option.value}`]: true,
      "appearance-menu__color-scheme--active": this.colorScheme === option.value
    });

    return (
      <fieldset className="appearance-menu__radio-group">
        <legend className="screen-reader-text">
          Select color scheme for reader
        </legend>
        {this.colorSchemeOptions.map(option => (
          <label key={option.value} className={labelClassName(option)}>
            <input
              value={option.value}
              name={this.colorSchemeControlName}
              type="radio"
              checked={option.value === this.colorScheme}
              onChange={this.handleColorSchemeControl}
              className="appearance-menu__radio-input"
            />
            <Utility.IconComposer
              icon="CheckUnique"
              size={30}
              iconClass="appearance-menu__color-scheme-icon"
            />
            <span className="screen-reader-text">
              {option.label}
            </span>
          </label>
        ))}
      </fieldset>
    );
  }

  renderFontControls() {
    return (
      <li className={this.sectionClassNames}>
        <div className={this.controlFontWrapperClassNames}>
          <div className={this.controlFontStyleClassNames}>
            {this.renderFontStyleControl()}
          </div>
          <div className={this.controlFontClassNames}>
            <div role="group" aria-label="Adjust font size">
              <button
                className={this.fontSizeButtonClassNames}
                disabled={this.serifDisabled}
                aria-disabled={!this.fontSizeDecreasable}
                onClick={event => {
                  this.decrementSizeHandler(event, this.fontSizeDecreasable);
                }}
              >
                <Utility.IconComposer icon="MinusUnique" size={30} />
                <span className={this.screenReaderTextClassNames}>
                  {"Decrease font size"}
                </span>
              </button>
              <button
                className={this.fontSizeButtonClassNames}
                disabled={this.serifDisabled}
                aria-disabled={!this.fontSizeIncreasable}
                onClick={event => {
                  this.incrementSizeHandler(event, this.fontSizeIncreasable);
                }}
              >
                <Utility.IconComposer icon="PlusUnique" size={30} />
                <span className={this.screenReaderTextClassNames}>
                  {"Increase font size"}
                </span>
              </button>
            </div>
          </div>
          <div className={this.controlFontClassNames}>
            <div>
              <button
                className={this.fontSizeButtonClassNames}
                disabled={this.sansDisabled}
                aria-disabled={!this.fontSizeDecreasable}
                onClick={event => {
                  this.decrementSizeHandler(event, this.fontSizeDecreasable);
                }}
              >
                <Utility.IconComposer icon="MinusUnique" size={30} />
                <span className={this.screenReaderTextClassNames}>
                  {"Decrease font size"}
                </span>
              </button>
              <button
                className={this.fontSizeButtonClassNames}
                disabled={this.sansDisabled}
                aria-disabled={!this.fontSizeIncreasable}
                onClick={event => {
                  this.incrementSizeHandler(event, this.fontSizeIncreasable);
                }}
              >
                <Utility.IconComposer icon="PlusUnique" size={30} />
                <span className={this.screenReaderTextClassNames}>
                  {"Increase font size"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </li>
    )
  }

  renderColorSchemeControls() {
    return (
      <li className={this.sectionClassNames}>
        <div className={this.colorButtonContainerClassNames}>
          {this.renderColorSchemeControl()}
        </div>
      </li>
    )
  }

  renderMarginControls() {
    return (
      <li className={this.sectionClassNames}>
        <div
          role="group"
          aria-label="Adjust text margins"
          className={this.controlMarginsClassNames}
        >
          <button
            className={this.marginButtonClassNames}
            aria-disabled={!this.marginIncreaseable}
            onClick={this.incrementMarginsHandler}
          >
            <Utility.IconComposer
              icon="MarginIncreaseUnique"
              iconClass={this.marginIconClassNames}
            />
            <span className={this.screenReaderTextClassNames}>
              {"Increase text margins"}
            </span>
          </button>
          <button
            className={this.marginButtonClassNames}
            aria-disabled={!this.marginDecreasable}
            onClick={this.decrementMarginsHandler}
          >
            <Utility.IconComposer
              icon="MarginDecreaseUnique"
              iconClass={this.marginIconClassNames}
              />
            <span className={this.screenReaderTextClassNames}>
              {"Decrease text margins"}
            </span>
          </button>
        </div>
      </li>
    )
  }

  render() {
    return (
      <div className={this.containerClassNames}>
        <header className={this.headerClassNames}>
          <h4 className={this.headingClassNames}>{"Adjust Appearance:"}</h4>
        </header>
        <ul className={this.listClassNames}>
          {this.renderFontControls()}
          {this.renderColorSchemeControls()}
          {this.renderMarginControls()}
        </ul>
        <div>
          <button
          className={this.resetButtonClassNames}
          disabled={this.resetDisabled}
          onClick={this.resetHandler}
          >
            <Utility.IconComposer
              icon="reload24"
              size={32}
              iconClass={this.reloadIconClassNames}
            />
            <span>
              {"Reset to Defaults"}
            </span>
          </button>
        </div>
      </div>
    );
  }
}

export default withScreenReaderStatus(AppearanceMenuBody);
