import React, { Component, PropTypes } from 'react';

export default class UserButton extends Component {

  static propTypes = {
    showLoginOverlay: PropTypes.func,
    authenticated: PropTypes.bool,
    userAvatar: PropTypes.string
  };

  // TODO: Get this dynamically from user data
  static defaultProps = {
    userAvatar: '/placeholder/user-avatar-dreft01.jpg'
  };

  UIToggleUserMenu = (event) => {
    console.log("You're logged in, so this will trigger a menu action:" + event);
  };

  UIShowLoginOverlay = (event) => {
    this.props.showLoginOverlay();
  };

  avatarImage = () => {
    let output = '';
    if (this.props.authenticated && this.props.userAvatar) {
      output = (
          <img className="avatar-image" src={this.props.userAvatar}/>
      );
    } else {
      output = (
          <i className="manicon manicon-person"></i>
      );
    }

    return output;
  };

  render = () => {
    return (
        <button className="button-avatar" onClick={this.props.authenticated ? this.UIToggleUserMenu.bind(this) : this.UIShowLoginOverlay.bind(this)}>
          <span className="screen-reader-text">{'Click to login or open user settings'}</span>
          {this.avatarImage()}
        </button>
    );
  };
}

