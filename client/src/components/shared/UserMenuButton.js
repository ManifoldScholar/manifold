import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class UserButton extends Component {

  static propTypes = {
    toggleUserMenu: PropTypes.func,
    showLoginOverlay: PropTypes.func,
    authenticated: PropTypes.bool,
    userAvatar: PropTypes.string
  };

  // TODO: Get this dynamically from user data
  static defaultProps = {
    userAvatar: '/placeholder/user-avatar-dreft01.jpg'
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
    const buttonClass = classNames({
      'button-avatar': true,
      'button-active': this.props.menuVisible
    });
    return (
        <button onClick={this.props.authenticated ? this.props.toggleUserMenu : this.props.showLoginOverlay} className={buttonClass} >
          <span className="screen-reader-text">{'Click to login or open user settings'}</span>
          <figure className="avatar">
            {this.avatarImage()}
          </figure>
        </button>
    );
  };
}

