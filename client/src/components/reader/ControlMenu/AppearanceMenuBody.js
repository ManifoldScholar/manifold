import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class AppearanceMenuBody extends Component {
  static displayName = "ControlMenu.AppearanceMenuBody";

  static propTypes = {
    appearance: PropTypes.object,
    selectFont: PropTypes.func,
    setColorScheme: PropTypes.func,
    incrementFontSize: PropTypes.func,
    decrementFontSize: PropTypes.func,
    incrementMargins: PropTypes.func,
    decrementMargins: PropTypes.func
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
    if (enabled) this.props.incrementFontSize();
  };

  decrementSizeHandler = (event, enabled) => {
    event.stopPropagation();
    if (enabled) this.props.decrementFontSize();
  };

  incrementMarginsHandler = event => {
    event.stopPropagation();
    this.props.incrementMargins();
  };

  decrementMarginsHandler = event => {
    event.stopPropagation();
    this.props.decrementMargins();
  };

  serifButtonHandler = event => {
    this.selectFontHandler(event, "serif");
  };

  sansSerifButtonHandler = event => {
    this.selectFontHandler(event, "sans-serif");
  };

  handleLightButtonClick = event => {
    this.setColorHandler(event, "light");
  };

  handleDarkButtonClick = event => {
    this.setColorHandler(event, "dark");
  };

  render() {
    const typography = this.props.appearance.typography;
    const fontSize = this.props.appearance.typography.fontSize;
    const colorScheme = this.props.appearance.colors.colorScheme;

    // Conditional Classes
    const serifButtonClass = classNames({
      "font-type serif": true,
      "button-active": typography.font === "serif"
    });
    const sansSerifButtonClass = classNames({
      "font-type sans-serif": true,
      "button-active": typography.font === "sans-serif"
    });
    const lightSchemeButtonClass = classNames({
      "color-scheme": true,
      light: true,
      "button-active": colorScheme === "light"
    });
    const darkSchemeButtonClass = classNames({
      "color-scheme": true,
      dark: true,
      "button-active": colorScheme === "dark"
    });

    const sansDecreasable =
      fontSize.current > fontSize.min && typography.font === "sans-serif";
    const sansIncreasable =
      fontSize.current < fontSize.max && typography.font === "sans-serif";
    const serifDecreasable =
      fontSize.current > fontSize.min && typography.font === "serif";
    const serifIncreasable =
      fontSize.current < fontSize.max && typography.font === "serif";

    return (
      <nav className="appearance-menu">
        <ul>
          <li>
            <div className="control-font">
              <button
                className={serifButtonClass}
                onClick={this.serifButtonHandler}
              >
                {"Serif"}
              </button>
              <div className="font-size">
                <button
                  disabled={!serifDecreasable}
                  onClick={event => {
                    this.decrementSizeHandler(event, serifDecreasable);
                  }}
                >
                  <i className="manicon manicon-dash" />
                  <span className="screen-reader-text">
                    {"Click to decrease font-size"}
                  </span>
                </button>
                <button
                  disabled={!serifIncreasable}
                  onClick={event => {
                    this.incrementSizeHandler(event, serifIncreasable);
                  }}
                >
                  <i className="manicon manicon-plus" />
                  <span className="screen-reader-text">
                    {"Click to increase font-size"}
                  </span>
                </button>
              </div>
            </div>
            <div className="control-font">
              <button
                className={sansSerifButtonClass}
                onClick={this.sansSerifButtonHandler}
              >
                {"Sans-serif"}
              </button>

              <div className="font-size">
                <button
                  disabled={!sansDecreasable}
                  onClick={event => {
                    this.decrementSizeHandler(event, sansDecreasable);
                  }}
                >
                  <i className="manicon manicon-dash" />
                  <span className="screen-reader-text">
                    {"Click to decrease font-size"}
                  </span>
                </button>
                <button
                  disabled={!sansIncreasable}
                  onClick={event => {
                    this.incrementSizeHandler(event, sansIncreasable);
                  }}
                >
                  <i className="manicon manicon-plus" />
                  <span className="screen-reader-text">
                    {"Click to increase font-size"}
                  </span>
                </button>
              </div>
            </div>
          </li>
          <li>
            <div className="control-colors">
              <button
                className={lightSchemeButtonClass}
                onClick={this.handleLightButtonClick}
              >
                <i className="manicon manicon-check" />
                <span className="screen-reader-text">
                  {"Click to use light color scheme in reader"}
                </span>
              </button>
              <button
                className={darkSchemeButtonClass}
                onClick={this.handleDarkButtonClick}
              >
                <i className="manicon manicon-check" />
                <span className="screen-reader-text">
                  {"Click to use dark color scheme in reader"}
                </span>
              </button>
            </div>
          </li>
          <li>
            <div className="control-margins">
              <button
                className="margin-increase"
                onClick={this.incrementMarginsHandler}
              >
                <i className="compound-icon">
                  <i className="manicon manicon-margins-narrow-arrows" />
                  <i className="manicon manicon-margins-narrow-text" />
                </i>
                <span className="screen-reader-text">
                  {"Click to increase text margins"}
                </span>
              </button>
              <button
                className="margin-decrease"
                onClick={this.decrementMarginsHandler}
              >
                <i className="compound-icon">
                  <i className="manicon manicon-margins-wide-arrows" />
                  <i className="manicon manicon-margins-wide-text" />
                </i>
                <span className="screen-reader-text">
                  {"Click to increase text margins"}
                </span>
              </button>
            </div>
          </li>
        </ul>
      </nav>
    );
  }
}
