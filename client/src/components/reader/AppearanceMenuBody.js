import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class AppearanceMenuBody extends Component {

  static propTypes = {
    appearance: PropTypes.object,
    selectFont: PropTypes.func,
    incrementFontSize: PropTypes.func,
    decrementFontSize: PropTypes.func,
    setColorScheme: PropTypes.func
  };

  setColorHandler = (event, scheme) => {
    event.stopPropagation();
    this.props.setColorScheme(scheme);
  };

  selectFontHandler = (event, font) => {
    event.stopPropagation();
    this.props.selectFont(font);
  };

  incrementSizeHandler = (event) => {
    event.stopPropagation();
    this.props.incrementFontSize();
  };

  decrementSizeHandler = (event) => {
    event.stopPropagation();
    this.props.decrementFontSize();
  };

  handleSerifButtonClick = (event) => {
    this.selectFontHandler(event, 'serif');
  };

  handleSansSerifButtonClick = (event) => {
    this.selectFontHandler(event, 'sans-serif');
  };

  handleLightButtonClick = (event) => {
    this.setColorHandler(event, 'light');
  };

  handleDarkButtonClick = (event) => {
    this.setColorHandler(event, 'dark');
  };


  render = () => {
    const typography = this.props.appearance.typography;
    const colorScheme = this.props.appearance.colors.colorScheme;

    // Conditional Classes
    const serifButtonClass = classNames({
      'font-type serif': true,
      'button-active': typography.font === 'serif'
    });
    const sansSerifButtonClass = classNames({
      'font-type sans-serif': true,
      'button-active': typography.font === 'sans-serif'
    });
    const lightSchemeButtonClass = classNames({
      light: true,
      'button-active': colorScheme === 'light'
    });
    const darkSchemeButtonClass = classNames({
      dark: true,
      'button-active': colorScheme === 'dark'
    });

    return (
        <nav className="appearance-menu">
          <div className="control-font">
            <button
              className={serifButtonClass}
              onClick={this.handleSerifButtonClick}
            >
              {'Serif'}
            </button>

            <div className="font-size">
              <button
                disabled={typography.size === typography.sizeMin ||
                  typography.font === 'sans-serif'}
                onClick={this.decrementSizeHandler}
              >
                <i className="manicon manicon-dash"></i>
                <span className="screen-reader-text">
                  {'Click to decrease font-size'}
                </span>
              </button>
              <button
                disabled={typography.size === typography.sizeMax ||
                  typography.font === 'sans-serif'}
                onClick={this.incrementSizeHandler}
              >
                <i className="manicon manicon-plus"></i>
                <span className="screen-reader-text">
                  {'Click to increase font-size'}
                </span>
              </button>
            </div>
          </div>
          <div className="control-font">
            <button className={sansSerifButtonClass}
              onClick={this.handleSansSerifButtonClick}
            >
              {'Sans Serif'}
            </button>

            <div className="font-size">
              <button
                disabled={typography.size === typography.sizeMin ||
                  typography.font === 'serif'}
                onClick={this.decrementSizeHandler}
              >
                <i className="manicon manicon-dash"></i>
                <span className="screen-reader-text">
                  {'Click to decrease font-size'}
                </span>
              </button>
              <button
                disabled={typography.size === typography.sizeMax ||
                  typography.font === 'serif'}
                onClick={this.incrementSizeHandler}
              >
                <i className="manicon manicon-plus"></i>
                <span className="screen-reader-text">
                  {'Click to increase font-size'}
                </span>
              </button>
            </div>
          </div>

          <div className="control-color">
            <button className={lightSchemeButtonClass}
              onClick={this.handleLightButtonClick}
            >
              <i className="manicon manicon-check"></i>
              <span className="screen-reader-text">
                {'Click to use light color scheme in reader'}
              </span>
            </button>
            <button className={darkSchemeButtonClass}
              onClick={this.handleDarkButtonClick}
            >
              <i className="manicon manicon-check"></i>
              <span className="screen-reader-text">
                {'Click to use dark color scheme in reader'}
              </span>
            </button>
          </div>
        </nav>
    );
  };
}
