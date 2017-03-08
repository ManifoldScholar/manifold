import React, { Component, PropTypes } from 'react';

export default class ReturnMenuButton extends Component {

  static displayName = 'ReturnMenuButton';

  static propTypes = {
    toggleReaderMenu: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler(event) {
    event.stopPropagation();
    this.props.toggleReaderMenu();
  }

  render() {
    // NB: An active prop is passed to the button by default and can be used
    // to set a classname here.
    return (
      <button className="button-menu" onClick={this.clickHandler}>
        Menu
      </button>
    );
  }
}
