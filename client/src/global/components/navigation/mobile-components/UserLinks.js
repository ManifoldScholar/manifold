import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import lh from "helpers/linkHandler";
import Avatar from "global/components/avatar";
import IconComposer from "global/components/utility/IconComposer";

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
        <ul className="nested-nav__list nested-nav__list--user-links">
          <li className="nested-nav__item">
            <button
              className="nested-nav__button nested-nav__grid-item"
              onClick={this.handleLoginClick}
              aria-describedby="user-menu-login-mobile"
            >
              <Avatar />
              <span className="nested-nav__button-text">Login</span>
            </button>
            <span id="user-menu-login-mobile" className="aria-describedby">
              Login to Manifold
            </span>
          </li>
        </ul>
      );

    const { currentUser } = this.props.authentication;

    return (
      <ul className="nested-nav__list nested-nav__list--user-links">
        <li className="nested-nav__item">
          <div
            className="nested-nav__grid-item"
            aria-describedby="user-menu-avatar-mobile"
          >
            <Avatar
              url={get(
                this.props.authentication,
                "currentUser.attributes.avatarStyles.smallSquare"
              )}
            />
            <span className="nested-nav__button-text">
              {currentUser.attributes.nickname}
            </span>
          </div>
        </li>
        <li className="nested-nav__item">
          <button
            className="nested-nav__button"
            onClick={this.handleProfileClick}
            aria-describedby="user-menu-edit-profile-mobile"
          >
            <div className="nested-nav__grid-item">
              <IconComposer
                icon="editProfile24"
                size={32}
                iconClass="nested-nav__button-icon"
              />
              <span className="nested-nav__button-text">Edit Profile</span>
            </div>
          </button>
          <span id="user-menu-edit-profile-mobile" className="aria-describedby">
            Edit your profile
          </span>
        </li>
        <li className="nested-nav__item">
          <button
            className="nested-nav__button"
            onClick={this.handleNotificationsClick}
            aria-describedby="user-menu-notifications-mobile"
          >
            <div className="nested-nav__grid-item">
              <IconComposer
                icon="notifications24"
                size={32}
                iconClass="nested-nav__button-icon"
              />
              <span className="nested-nav__button-text">Notifications</span>
            </div>
          </button>
          <span
            id="user-menu-notifications-mobile"
            className="aria-describedby"
          >
            Edit your notification settings
          </span>
        </li>
        <li className="nested-nav__item">
          <button
            className="nested-nav__button"
            onClick={this.handleLogOutClick}
            aria-describedby="user-menu-logout-mobile"
          >
            <div className="nested-nav__grid-item">
              <IconComposer
                icon="logout24"
                size={32}
                iconClass="nested-nav__button-icon"
              />
              <span className="nested-nav__button-text">Logout</span>
            </div>
          </button>
          <span id="user-menu-logout-mobile" className="aria-describedby">
            Logout of Manifold
          </span>
        </li>
        <li className="nested-nav__footer">{this.props.backendButton}</li>
      </ul>
    );
  }
}
