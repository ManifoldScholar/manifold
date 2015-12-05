import React, { Component, PropTypes } from 'react';

export default class UserButton extends Component {

  static propTypes = {
    showLoginOverlay: PropTypes.func,
    authenticated: PropTypes.bool
  };

  UIToggleUserMenu = (event) => {
    console.log("You're logged in, so this will trigger a menu action:" + event);
  };

  UIShowLoginOverlay = (event) => {
    this.props.showLoginOverlay();
  };

  render = () => {
    return (
        <button className="button-avatar" onClick={this.props.authenticated ? this.UIToggleUserMenu.bind(this) : this.UIShowLoginOverlay.bind(this)}>
          <i className="manicon manicon-person"></i>
          <span className="screen-reader-text">{'Click to open user settings'}</span>
        </button>
    );
  };
}

