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
    visible: PropTypes.bool
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

  render() {
    const menuClass = classNames({
      "user-menu": true,
      "menu-hidden": !this.props.visible,
      "menu-visible": this.props.visible
    });

    return (
      <nav className={menuClass}>
        <i className="user-menu__tail tail" />
        <ul className="user-menu__list">
          <li className="user-menu__item">
            <button
              className="user-menu__link"
              onClick={this.handleProfileClick}
              aria-describedby="user-menu-edit-profile"
            >
              <IconComposer
                icon="editProfile24"
                size={53.3}
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
                size={53.3}
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
              onClick={this.logout}
              aria-describedby="user-menu-logout"
            >
              <IconComposer
                icon="logout24"
                size={53.3}
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
