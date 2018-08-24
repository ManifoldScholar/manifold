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
        <i className="tail" />
        <ul>
          <li>
            <button onClick={this.handleProfileClick}>
              <i
                className="manicon manicon-person-pencil-simple"
                aria-hidden="true"
              />
              {"Edit Profile"}
            </button>
          </li>
          <li>
            <button onClick={this.handleNotificationsClick}>
              <i
                className="manicon manicon-envelope-circle-right"
                aria-hidden="true"
              />
              {"Notifications"}
            </button>
          </li>
          <li>
            <button onClick={this.logout}>
              <i
                className="manicon manicon-circle-arrow-out-right"
                aria-hidden="true"
              />
              {"Logout"}
            </button>
          </li>
        </ul>
      </nav>
    );
  }
}

export default withRouter(UserMenuBodyComponent);
