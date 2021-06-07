import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import lh from "helpers/linkHandler";
import Avatar from "global/components/avatar";
import Link from "./Link";
import { Translation } from "react-i18next";

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
        <Translation>
          {t => (
            <ul className="nested-nav__list nested-nav__list--user-links">
              <li className="nested-nav__item">
                <button
                  className="nested-nav__button"
                  onClick={this.handleLoginClick}
                  aria-describedby="user-menu-login-mobile"
                >
                  <div className="nested-nav__grid-item">
                    <Avatar />
                    <span className="nested-nav__button-text">
                      {t(`login`)}
                    </span>
                  </div>
                </button>
              </li>
            </ul>
          )}
        </Translation>
      );

    const { currentUser } = this.props.authentication;

    return (
      <Translation>
        {t => (
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
                  to={lh.link("frontendMyReadingGroups")}
                  title="My Reading Groups"
                  icon="annotationGroup24"
                  onClick={() => this.props.closeNavigation()}
                />
              </>
            )}
            <Link
              to={lh.link("subscriptions")}
              title={t(`notifications`)}
              srTitle={t(`edit-your-notification-settings`)}
              icon="notifications24"
              onClick={() => this.props.closeNavigation()}
            />
            <Link
              as="button"
              title={t(`edit-profile`)}
              srTitle={t(`edit-your-profile`)}
              icon="editProfile24"
              onClick={this.handleProfileClick}
            />
            <Link
              as="button"
              title={t(`logout`)}
              icon="logout24"
              onClick={this.handleLogOutClick}
            />
            <li className="nested-nav__footer">{this.props.backendButton}</li>
          </ul>
        )}
      </Translation>
    );
  }
  /* eslint-enable jsx-a11y/anchor-is-valid */
}
