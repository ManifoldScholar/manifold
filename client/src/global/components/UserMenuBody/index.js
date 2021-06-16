import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import lh from "helpers/linkHandler";
import withCurrentUser from "hoc/with-current-user";
import Link from "./Link";

export class UserMenuBody extends Component {
  static propTypes = {
    hideUserMenu: PropTypes.func.isRequired,
    startLogout: PropTypes.func.isRequired,
    showLoginOverlay: PropTypes.func.isRequired,
    visible: PropTypes.bool,
    context: PropTypes.oneOf(["frontend", "backend", "reader"])
  };

  static defaultProps = {
    context: "frontend"
  };

  get currentUser() {
    return this.props.currentUser;
  }

  get canAccessReadingGroups() {
    if (!this.currentUser) return false;
    return this.currentUser.attributes.classAbilities.readingGroup.read;
  }

  handleProfileClick = eventIgnored => {
    this.props.hideUserMenu();
    this.props.showLoginOverlay();
  };

  handleLogoutClick = () => {
    this.props.startLogout();
    this.props.hideUserMenu();
  };

  // jsx-a11y chokes on <Link as="button" /> here,
  // but that's just the name of the component.
  // The correct HTML element is used in <Link />.

  /* eslint-disable jsx-a11y/anchor-is-valid */
  render() {
    const menuClass = classNames({
      "user-menu": true,
      [`user-menu--${this.props.context}`]: true,
      "menu-hidden": !this.props.visible,
      "menu-visible": this.props.visible
    });

    return (
      <nav className={menuClass}>
        {this.props.context !== "reader" && (
          <i className="user-menu__tail tail" />
        )}
        <ul className="user-menu__list">
          {!!this.currentUser && (
            <Link
              to={lh.link("frontendStarred")}
              title="My Starred"
              srTitle="View My Starred page"
              icon="star24"
              onClick={() => this.props.hideUserMenu()}
            />
          )}
          {this.canAccessReadingGroups && (
            <>
              <Link
                to={lh.link("frontendAnnotations")}
                title="My Notes + Comments"
                icon="notes24"
                onClick={() => this.props.hideUserMenu()}
              />
              <Link
                to={lh.link("frontendMyReadingGroups")}
                title="My Reading Groups"
                icon="annotationGroup24"
                onClick={() => this.props.hideUserMenu()}
              />
            </>
          )}
          <Link
            as="button"
            title="Edit Profile"
            srTitle="Edit my profile"
            icon="editProfile24"
            onClick={this.handleProfileClick}
          />
          <Link
            to={lh.link("subscriptions")}
            title="Notifications"
            srTitle="Edit my notification settings"
            icon="notifications24"
            onClick={() => this.props.hideUserMenu()}
          />
          <Link
            as="button"
            title="Logout"
            icon="logout24"
            onClick={this.handleLogoutClick}
          />
        </ul>
      </nav>
    );
  }
  /* eslint-enable jsx-a11y/anchor-is-valid */
}

export default withCurrentUser(UserMenuBody);
