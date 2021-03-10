import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import lh from "helpers/linkHandler";
import Avatar from "global/components/avatar";
import Link from "./Link";

export default class UserLinks extends PureComponent {
  static propTypes = {
    authentication: PropTypes.object,
    commonActions: PropTypes.object.isRequired,
    backendButton: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    history: PropTypes.object.isRequired,
    closeNavigation: PropTypes.func.isRequired
  };

  get canAccessReadingGroups() {
    const { currentUser } = this.props.authentication;
    if (!currentUser) return false;
    return currentUser.attributes.classAbilities.readingGroup.read;
  }

  handleProfileClick = eventIgnored => {
    this.props.commonActions.toggleSignInUpOverlay();
    this.props.closeNavigation();
  };

  handleLogOutClick = eventIgnored => {
    this.props.commonActions.logout();
    this.props.closeNavigation();
  };

  handleLoginClick = eventIgnored => {
    this.props.commonActions.toggleSignInUpOverlay();
    this.props.closeNavigation();
  };

  // jsx-a11y chokes on <Link as="button" /> here,
  // but that's just the name of the component.
  // The correct HTML element is used in <Link />.

  /* eslint-disable jsx-a11y/anchor-is-valid */
  render() {
    if (!this.props.authentication.authenticated)
      return (
        <ul className="nested-nav__list nested-nav__list--user-links">
          <li className="nested-nav__item">
            <button
              className="nested-nav__button"
              onClick={this.handleLoginClick}
              aria-describedby="user-menu-login-mobile"
            >
              <div className="nested-nav__grid-item">
                <Avatar />
                <span className="nested-nav__button-text">Login</span>
              </div>
            </button>
            <span id="user-menu-login-mobile" className="aria-describedby">
              Login to Manifold
            </span>
          </li>
        </ul>
      );

    const { currentUser } = this.props.authentication;

    return (
      <ul
        aria-label="User Links"
        className="nested-nav__list nested-nav__list--user-links"
      >
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
        {!!currentUser && (
          <Link
            to={lh.link("frontendStarred")}
            title="My Starred"
            icon="star24"
            onClick={() => this.props.closeNavigation()}
          />
        )}
        {this.canAccessReadingGroups && (
          <>
            <Link
              to={lh.link("frontendAnnotations")}
              title="My Notes + Comments"
              icon="notes24"
              onClick={() => this.props.closeNavigation()}
            />
            <Link
              to={lh.link("frontendReadingGroups")}
              title="My Reading Groups"
              icon="annotationGroup24"
              onClick={() => this.props.closeNavigation()}
            />
          </>
        )}
        <Link
          to={lh.link("subscriptions")}
          title="Notifications"
          srTitle="Edit my notification settings"
          icon="notifications24"
          onClick={() => this.props.closeNavigation()}
        />
        <Link
          as="button"
          title="Edit Profile"
          srTitle="Edit my profile"
          icon="editProfile24"
          onClick={this.handleProfileClick}
        />
        <Link
          as="button"
          title="Logout"
          icon="logout24"
          onClick={this.handleLogOutClick}
        />
        <li className="nested-nav__footer">{this.props.backendButton}</li>
      </ul>
    );
  }
  /* eslint-enable jsx-a11y/anchor-is-valid */
}
