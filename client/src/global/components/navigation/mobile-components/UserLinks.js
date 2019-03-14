import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import lh from "helpers/linkHandler";
import Avatar from "global/components/avatar";

export default class UserLinks extends PureComponent {
  static propTypes = {
    authentication: PropTypes.object,
    commonActions: PropTypes.object.isRequired,
    backendButton: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    history: PropTypes.object.isRequired,
    closeNavigation: PropTypes.func.isRequired
  };

  handleProfileClick = event => {
    event.preventDefault();
    this.props.commonActions.toggleSignInUpOverlay();
    this.props.closeNavigation();
  };

  handleNotificationsClick = event => {
    event.preventDefault();
    this.props.closeNavigation();
    this.props.history.push(lh.link("subscriptions"));
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
              <button
                onClick={this.handleLoginClick}
                aria-describedby="user-menu-login-mobile"
              >
                <Avatar />
                {"Login"}
              </button>
              <span id="user-menu-login-mobile" className="aria-describedby">
                Login to Manifold
              </span>
            </li>
          </ul>
        </div>
      );

    const { currentUser } = this.props.authentication;

    return (
      <div className="user-links">
        <ul>
          <li>
            <div
              className="user-links__item"
              aria-describedby="user-menu-avatar-mobile"
            >
              <Avatar
                url={get(
                  this.props.authentication,
                  "currentUser.attributes.avatarStyles.smallSquare"
                )}
              />
              {currentUser.attributes.nickname}
            </div>
          </li>
          <li>
            <button
              onClick={this.handleProfileClick}
              aria-describedby="user-menu-edit-profile-mobile"
            >
              <i
                className="manicon manicon-person-pencil-simple"
                aria-hidden="true"
              />
              {"Edit Profile"}
            </button>
            <span
              id="user-menu-edit-profile-mobile"
              className="aria-describedby"
            >
              Edit your profile
            </span>
          </li>
          <li>
            <button
              onClick={this.handleNotificationsClick}
              aria-describedby="user-menu-notifications-mobile"
            >
              <i
                className="manicon manicon-envelope-circle-right"
                aria-hidden="true"
              />
              {"Notifications"}
            </button>
            <span
              id="user-menu-notifications-mobile"
              className="aria-describedby"
            >
              Edit your notification settings
            </span>
          </li>
          <li>
            <button
              onClick={this.handleLogOutClick}
              aria-describedby="user-menu-logout-mobile"
            >
              <i
                className="manicon manicon-circle-arrow-out-right-long"
                aria-hidden="true"
              />
              {"Logout"}
            </button>
            <span id="user-menu-logout-mobile" className="aria-describedby">
              Logout of Manifold
            </span>
          </li>
          <li>{this.props.backendButton}</li>
        </ul>
      </div>
    );
  }
}
