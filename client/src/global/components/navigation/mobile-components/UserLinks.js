import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import get from "lodash/get";
import lh from "helpers/linkHandler";
import Avatar from "global/components/avatar";
import Link from "./Link";

class UserLinks extends PureComponent {
  static propTypes = {
    authentication: PropTypes.object,
    commonActions: PropTypes.object.isRequired,
    backendButton: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    history: PropTypes.object.isRequired,
    closeNavigation: PropTypes.func.isRequired,
    t: PropTypes.func
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
    const t = this.props.t;

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
                <span className="nested-nav__button-text">
                  {t("navigation.user.login")}
                </span>
              </div>
            </button>
            <span id="user-menu-login-mobile" className="screen-reader-text">
              {t("navigation.user.login_to_manifold")}
            </span>
          </li>
        </ul>
      );

    const { currentUser } = this.props.authentication;

    return (
      <ul
        aria-label={t("navigation.user_links")}
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
            title={t("pages.my_starred")}
            icon="star24"
            onClick={() => this.props.closeNavigation()}
          />
        )}
        {this.canAccessReadingGroups && (
          <>
            <Link
              to={lh.link("frontendAnnotations")}
              title={t("pages.my_notes")}
              icon="notes24"
              onClick={() => this.props.closeNavigation()}
            />
            <Link
              to={lh.link("frontendMyReadingGroups")}
              title={t("pages.my_groups")}
              icon="annotationGroup24"
              onClick={() => this.props.closeNavigation()}
            />
          </>
        )}
        <Link
          as="button"
          title={t("navigation.user.edit_profile")}
          srTitle={t("navigation.user.edit_profile_sr_title")}
          icon="editProfile24"
          onClick={this.handleProfileClick}
        />
        <Link
          to={lh.link("subscriptions")}
          title={t("navigation.user.notifications")}
          srTitle={t("navigation.user.notifications_sr_title")}
          icon="notifications24"
          onClick={() => this.props.closeNavigation()}
        />
        <Link
          to={lh.link("privacy")}
          title={t("navigation.user.privacy")}
          srTitle={t("navigation.user.privacy_sr_title")}
          icon="privacy24"
          onClick={() => this.props.closeNavigation()}
        />
        <Link
          as="button"
          title={t("navigation.user.logout")}
          icon="logout24"
          onClick={this.handleLogOutClick}
        />
        <li className="nested-nav__footer">{this.props.backendButton}</li>
      </ul>
    );
  }
  /* eslint-enable jsx-a11y/anchor-is-valid */
}

export default withTranslation()(UserLinks);
