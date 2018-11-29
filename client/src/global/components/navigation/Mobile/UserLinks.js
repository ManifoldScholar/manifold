import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import { Avatar } from "components/global";

export default class UserLinks extends PureComponent {
  static propTypes = {
    authentication: PropTypes.object,
    commonActions: PropTypes.object.isRequired,
    backendButton: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    closeNavigation: PropTypes.func.isRequired
  };

  handleProfileClick = event => {
    event.preventDefault();
    this.props.commonActions.toggleSignInUpOverlay();
    this.props.closeNavigation();
  };

  handleLogOutClick = event => {
    event.preventDefault();
    this.props.commonActions.logout();
    this.props.closeNavigation();
  };

  handleLoginClick = event => {
    event.preventDefault();
    this.props.commonActions.toggleSignInUpOverlay();
    this.props.closeNavigation();
  };

  render() {
    if (!this.props.authentication.authenticated)
      return (
        <div className="user-links">
          <ul>
            <li>
              <button onClick={this.handleLoginClick}>
                <Avatar />
                {"Login"}
              </button>
            </li>
          </ul>
        </div>
      );

    const { currentUser } = this.props.authentication;

    return (
      <div className="user-links">
        <ul>
          <li>
            <button onClick={this.handleProfileClick}>
              <Avatar
                url={get(
                  this.props.authentication,
                  "currentUser.attributes.avatarStyles.smallSquare"
                )}
              />
              {currentUser.attributes.nickname}
            </button>
          </li>
          <li>
            <button onClick={this.handleProfileClick}>
              <i
                className="manicon manicon-person-pencil-simple"
                aria-hidden="true"
              />
              {"Edit Profile"}
            </button>
          </li>
          <li>
            <button onClick={this.handleLogOutClick}>
              <i
                className="manicon manicon-circle-arrow-out-right-long"
                aria-hidden="true"
              />
              {"Logout"}
            </button>
          </li>
          <li>{this.props.backendButton}</li>
        </ul>
      </div>
    );
  }
}
