import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withRouter } from "react-router-dom";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";

export class UserMenuBodyComponent extends Component {
  static propTypes = {
    hideUserMenu: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    startLogout: PropTypes.func.isRequired,
    showLoginOverlay: PropTypes.func.isRequired,
    visible: PropTypes.bool,
    context: PropTypes.oneOf(["frontend", "backend", "reader"])
  };

  static defaultProps = {
    context: "frontend"
  };

  logout = () => {
    this.props.startLogout();
    this.props.hideUserMenu();
  };

  handleProfileClick = event => {
    event.preventDefault();
    this.props.hideUserMenu();
    this.props.showLoginOverlay();
  };

  handleNotificationsClick = event => {
    event.preventDefault();
    this.props.hideUserMenu();
    this.props.history.push(lh.link("subscriptions"));
  };

  handleReadingGroupsClick = event => {
    event.preventDefault();
    this.props.hideUserMenu();
    this.props.history.push(lh.link("frontendReadingGroups"));
  };

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
          <li className="user-menu__item">
            <button
              className="user-menu__link"
              onClick={this.handleProfileClick}
              aria-describedby="user-menu-edit-profile"
            >
              <IconComposer
                icon="editProfile24"
                size={32}
                iconClass="user-menu__icon"
              />
              <span className="user-menu__link-text">Edit Profile</span>
            </button>
            <span id="user-menu-edit-profile" className="aria-describedby">
              Edit your profile
            </span>
          </li>
          <li className="user-menu__item">
            <button
              className="user-menu__link"
              onClick={this.handleNotificationsClick}
              aria-describedby="user-menu-notifications"
            >
              <IconComposer
                icon="notifications24"
                size={32}
                iconClass="user-menu__icon"
              />
              <span className="user-menu__link-text">Notifications</span>
            </button>
            <span id="user-menu-notifications" className="aria-describedby">
              Edit your notification settings
            </span>
          </li>
          <li className="user-menu__item">
            <button
              className="user-menu__link"
              onClick={this.handleReadingGroupsClick}
              aria-describedby="user-menu-groups"
            >
              <IconComposer
                icon="annotationGroup24"
                size={32}
                iconClass="user-menu__icon"
              />
              <span className="user-menu__link-text">Manage Groups</span>
            </button>
            <span id="user-menu-groups" className="aria-describedby">
              Manage your Reading Groups
            </span>
          </li>
          <li className="user-menu__item">
            <button
              className="user-menu__link"
              onClick={this.logout}
              aria-describedby="user-menu-logout"
            >
              <IconComposer
                icon="logout24"
                size={32}
                iconClass="user-menu__icon"
              />
              <span className="user-menu__link-text">Logout</span>
            </button>
            <span id="user-menu-logout" className="aria-describedby">
              Logout of Manifold
            </span>
          </li>
        </ul>
      </nav>
    );
  }
}

export default withRouter(UserMenuBodyComponent);
