import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class SearchMenuButton extends Component {

  static propTypes = {
    toggleSearchMenu: PropTypes.func,
    active: PropTypes.bool
  };

  clickHandler = (event) => {
    event.stopPropagation();
    this.props.toggleSearchMenu();
  };

  render() {
    const buttonClass = classNames({
      'button-search': true,
      'button-active': this.props.active
    });
    return (
        <button className={buttonClass} onClick={this.clickHandler} data-id="toggle-menu">
          <i className="manicon manicon-magnify"></i>
          <span className="screen-reader-text">{'Click to open search'}</span>
        </button>
    );
  }
}
