import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class AppearanceMenuButton extends Component {

  static propTypes = {
    toggleAppearanceMenu: PropTypes.func,
    active: PropTypes.bool
  };

  clickHandler = (event) => {
    event.stopPropagation();
    this.props.toggleAppearanceMenu();
  };

  render() {
    const buttonClass = classNames({
      'button-appearance': true,
      'button-active': this.props.active
    });
    return (
        <button className={buttonClass} onClick={this.clickHandler}>
          <i className="manicon manicon-aa"></i>
          <span className="screen-reader-text">{'Click to open reader appearance menu'}</span>
        </button>
    );
  }
}
