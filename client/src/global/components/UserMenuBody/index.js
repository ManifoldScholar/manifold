import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withRouter } from "react-router-dom";
import lh from "helpers/linkHandler";

export class UserMenuBodyComponent extends Component {
  static propTypes = {
    hideUserMenu: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    startLogout: PropTypes.func.isRequired,
    showLoginOverlay: PropTypes.func.isRequired,
    visible: PropTypes.bool
  };

  handleNotificationsClick = event => {
    event.preventDefault();
    this.props.hideUserMenu();
    this.props.history.push(lh.link("subscriptions"));
  };

  handleProfileClick = event => {
    event.preventDefault();
    this.props.hideUserMenu();
    this.props.showLoginOverlay();
  };

  logout = () => {
    this.props.startLogout();
    this.props.hideUserMenu();
  };

  render() {
    const menuClass = classNames({
      "user-menu": true,
      "menu-hidden": !this.props.visible,
      "menu-visible": this.props.visible
    });

    return (
      <nav className={menuClass}>
        <i className="tail" />
        <ul>
          <li>
            <button
              onClick={this.handleProfileClick}
              aria-describedby="user-menu-edit-profile"
            >
              <i
                className="manicon manicon-person-pencil-simple"
                aria-hidden="true"
              />
              {"Edit Profile"}
            </button>
            <span id="user-menu-edit-profile" className="aria-describedby">
              Edit your profile
            </span>
          </li>
          <li>
            <button
              onClick={this.handleNotificationsClick}
              aria-describedby="user-menu-notifications"
            >
              <i
                className="manicon manicon-envelope-circle-right"
                aria-hidden="true"
              />
              {"Notifications"}
            </button>
            <span id="user-menu-notifications" className="aria-describedby">
              Edit your notification settings
            </span>
          </li>
          <li>
            <button onClick={this.logout} aria-describedby="user-menu-logout">
              <i
                className="manicon manicon-circle-arrow-out-right"
                aria-hidden="true"
              />
              {"Logout"}
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
