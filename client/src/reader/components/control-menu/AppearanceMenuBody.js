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

  setColorHandler = (event, scheme) => {
    event.stopPropagation();
    this.props.setColorScheme(scheme);
  };

  selectFontHandler = (event, font) => {
    event.stopPropagation();
    this.props.selectFont(font);
  };

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
    this.setColorHandler(event, "light");
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

  serifButtonHandler = event => {
    const fontType = "serif";
    this.selectFontHandler(event, fontType);
    this.props.setScreenReaderStatus(
      this.resetOptionMessage("font", fontType)
    );
  };

  sansSerifButtonHandler = event => {
    const fontType = "sans-serif";
    this.selectFontHandler(event, "sans-serif");
    this.props.setScreenReaderStatus(
      this.resetOptionMessage("font", fontType)
    );
  };

  handleLightButtonClick = event => {
    const colorScheme = "light";
    this.setColorHandler(event, colorScheme);
    this.props.setScreenReaderStatus(
      this.resetOptionMessage("color scheme", colorScheme)
    );
  };

  handleDarkButtonClick = event => {
    const colorScheme = "dark";
    this.setColorHandler(event, colorScheme);
    this.props.setScreenReaderStatus(
      this.resetOptionMessage("color scheme", colorScheme)
    );
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

  get sansDecreasable() {
    return this.fontSize.current > this.fontSize.min
    && this.typography.font === "sans-serif";
  }

  get sansIncreasable() {
    return this.fontSize.current < this.fontSize.max
    && this.typography.font === "sans-serif";
  }

  get serifDecreasable() {
    return this.fontSize.current > this.fontSize.min
    && this.typography.font === "serif";
  }

  get serifIncreasable() {
    return this.fontSize.current < this.fontSize.max
    && this.typography.font === "serif";
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

  get headingClassNames() {
    return "appearance-menu__heading";
  }

  get sectionClassNames() {
    return "appearance-menu__section";
  }

  get controlFontClassNames() {
    return "appearance-menu__font-controls";
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

  get serifButtonClassNames() {
    return classNames({
      "appearance-menu__font-type appearance-menu__font-type--serif": true,
      "appearance-menu__font-type--active": this.typography.font === "serif",
      "appearance-menu__button-base": true
    });
  }

  get sansSerifButtonClassNames() {
    return classNames({
      "appearance-menu__font-type appearance-menu__font-type--sans-serif": true,
      "appearance-menu__font-type--active": this.typography.font === "sans-serif",
      "appearance-menu__button-base": true
    });
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

  renderFontControls() {
    return (
      <li className={this.sectionClassNames}>
        <div className={this.controlFontClassNames}>
          <button
            className={this.serifButtonClassNames}
            onClick={this.serifButtonHandler}
          >
            {"Serif"}
          </button>
          <div>
            <button
              className={this.fontSizeButtonClassNames}
              disabled={!this.serifDecreasable}
              onClick={event => {
                this.decrementSizeHandler(event, this.serifDecreasable);
              }}
            >
              <Utility.IconComposer icon="MinusUnique" size={30} />
              <span className={this.screenReaderTextClassNames}>
                {"Decrease font size"}
              </span>
            </button>
            <button
              className={this.fontSizeButtonClassNames}
              disabled={!this.serifIncreasable}
              onClick={event => {
                this.incrementSizeHandler(event, this.serifIncreasable);
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
          <button
            className={this.sansSerifButtonClassNames}
            onClick={this.sansSerifButtonHandler}
          >
            {"Sans-serif"}
          </button>

          <div>
            <button
              className={this.fontSizeButtonClassNames}
              disabled={!this.sansDecreasable}
              onClick={event => {
                this.decrementSizeHandler(event, this.sansDecreasable);
              }}
            >
              <Utility.IconComposer icon="MinusUnique" size={30} />
              <span className={this.screenReaderTextClassNames}>
                {"Decrease font size"}
              </span>
            </button>
            <button
              className={this.fontSizeButtonClassNames}
              disabled={!this.sansIncreasable}
              onClick={event => {
                this.incrementSizeHandler(event, this.sansIncreasable);
              }}
            >
              <Utility.IconComposer icon="PlusUnique" size={30} />
              <span className={this.screenReaderTextClassNames}>
                {"Increase font size"}
              </span>
            </button>
          </div>
        </div>
      </li>
    )
  }

  renderColorSchemeControls() {
    return (
      <li className={this.sectionClassNames}>
        <div className={this.colorButtonContainerClassNames}>
          <button
            className={this.lightSchemeButtonClassNames}
            onClick={this.handleLightButtonClick}
          >
            <Utility.IconComposer icon="CheckUnique" size={30} />
            <span className={this.screenReaderTextClassNames}>
              {"Use light color scheme in reader"}
            </span>
          </button>
          <button
            className={this.darkSchemeButtonClassNames}
            onClick={this.handleDarkButtonClick}
          >
            <Utility.IconComposer icon="CheckUnique" size={30} />
            <span className={this.screenReaderTextClassNames}>
              {"Use dark color scheme in reader"}
            </span>
          </button>
        </div>
      </li>
    )
  }

  renderMarginControls() {
    return (
      <li className={this.sectionClassNames}>
        <div className={this.controlMarginsClassNames}>
          <button
            className={this.marginButtonClassNames}
            disabled={!this.marginIncreaseable}
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
            disabled={!this.marginDecreasable}
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
      <nav className={this.containerClassNames}>
        <ul>
          <li className={this.sectionClassNames}>
            <h4 className={this.headingClassNames}>{"Adjust Appearance:"}</h4>
          </li>
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
      </nav>
    );
  }
}

export default withScreenReaderStatus(AppearanceMenuBody);
