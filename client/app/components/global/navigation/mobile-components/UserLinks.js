import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Avatar from "components/global/avatar";
import { useAuthentication, useLogout } from "hooks";
import { useSignInUpOverlay } from "components/global/sign-in-up/Overlay/context";
import Link from "./Link";

/* eslint-disable jsx-a11y/anchor-is-valid */
export default function UserLinks({ backendButton, closeNavigation }) {
  const { t } = useTranslation();
  const authentication = useAuthentication();
  const logout = useLogout();
  const { toggle: toggleSignInUpOverlay } = useSignInUpOverlay();

  const { currentUser } = authentication;

  const canAccessReadingGroups =
    currentUser?.attributes.classAbilities.readingGroup.read;

  const handleProfileClick = () => {
    toggleSignInUpOverlay();
    closeNavigation();
  };

  const handleLogOutClick = () => {
    logout();
    closeNavigation();
  };

  const handleLoginClick = () => {
    toggleSignInUpOverlay();
    closeNavigation();
  };

  if (!authentication.authenticated)
    return (
      <ul className="nested-nav__list nested-nav__list--user-links">
        <li className="nested-nav__item">
          <button
            className="nested-nav__button"
            onClick={handleLoginClick}
            aria-describedby="user-menu-login-mobile"
          >
            <div className="nested-nav__grid-item">
              <Avatar />
              <span className="nested-nav__button-text">
                {t("navigation.user.log_in")}
              </span>
            </div>
          </button>
          <span id="user-menu-login-mobile" className="screen-reader-text">
            {t("navigation.user.log_in_to_manifold")}
          </span>
        </li>
      </ul>
    );

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
          <Avatar url={currentUser?.attributes.avatarStyles.smallSquare} />
          <span className="nested-nav__button-text">
            {currentUser.attributes.nickname}
          </span>
        </div>
      </li>
      {!!currentUser && (
        <Link
          to="/my/starred"
          title={t("pages.my_starred")}
          icon="star24"
          onClick={closeNavigation}
        />
      )}
      {canAccessReadingGroups && (
        <>
          <Link
            to="/my/notes"
            title={t("pages.my_notes")}
            icon="notes24"
            onClick={closeNavigation}
          />
          <Link
            to="/my/groups"
            title={t("pages.my_groups")}
            icon="annotationGroup24"
            onClick={closeNavigation}
          />
        </>
      )}
      <Link
        as="button"
        title={t("navigation.user.edit_profile")}
        srTitle={t("navigation.user.edit_profile_sr_title")}
        icon="editProfile24"
        onClick={handleProfileClick}
      />
      <Link
        to="/subscriptions"
        title={t("navigation.user.notifications")}
        srTitle={t("navigation.user.notifications_sr_title")}
        icon="notifications24"
        onClick={closeNavigation}
      />
      <Link
        to="/privacy"
        title={t("navigation.user.privacy")}
        srTitle={t("navigation.user.privacy_sr_title")}
        icon="privacy24"
        onClick={closeNavigation}
      />
      <Link
        as="button"
        title={t("navigation.user.log_out")}
        icon="logout24"
        onClick={handleLogOutClick}
      />
      <li className="nested-nav__footer">{backendButton}</li>
    </ul>
  );
}
/* eslint-enable jsx-a11y/anchor-is-valid */

UserLinks.displayName = "Navigation.Mobile.UserLinks";

UserLinks.propTypes = {
  backendButton: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  closeNavigation: PropTypes.func.isRequired
};
