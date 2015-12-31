import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class AppearanceMenuBody extends Component {

  static propTypes = {
    appearance: PropTypes.object,
    selectFont: PropTypes.func,
    incrementFontSize: PropTypes.func,
    decrementFontSize: PropTypes.func
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

  render = () => {
    const typography = this.props.appearance.typography;

    // Conditional Classes
    const serifButtonClass = classNames({'font-type serif': true, 'button-active': typography.font === 'serif'});
    const sansSerifButtonClass = classNames({'font-type sans-serif': true, 'button-active': typography.font === 'sans-serif'});

    return (
        <nav className="appearance-menu">
          <div className="control-font">
            <button className={serifButtonClass} onClick={(event) => { this.selectFontHandler(event, 'serif');}}>
              {'Serif'}
            </button>

            <div className="font-size">
              <button
                  disabled={typography.size === typography.sizeMin || typography.font === 'sans-serif'}
                  onClick={this.decrementSizeHandler}
              >
                <i className="manicon manicon-dash"></i>
                    <span className="screen-reader-text">
                      {'Click to decrease font-size'}
                    </span>
              </button>
              <button
                  disabled={typography.size === typography.sizeMax || typography.font === 'sans-serif'}
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
            <button className={sansSerifButtonClass} onClick={(event) => { this.selectFontHandler(event, 'sans-serif');}}>
              {'Sans Serif'}
            </button>

            <div className="font-size">
              <button
                  disabled={typography.size === typography.sizeMin || typography.font === 'serif'}
                  onClick={this.decrementSizeHandler}
              >
                <i className="manicon manicon-dash"></i>
                    <span className="screen-reader-text">
                      {'Click to decrease font-size'}
                    </span>
              </button>
              <button
                  disabled={typography.size === typography.sizeMax || typography.font === 'serif'}
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
            <button className="light">
              <i className="manicon manicon-check"></i>
                  <span className="screen-reader-text">
                    {'Click to use light color scheme in reader'}
                  </span>
            </button>
            <button className="dark">
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
