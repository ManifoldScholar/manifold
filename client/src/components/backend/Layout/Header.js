import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  HeaderNotifications,
  UIPanel,
  UserMenuBody,
  UserMenuButton,
  PressLogo
} from "components/global";
import { Link, NavLink } from "react-router-dom";
import startsWith from "lodash/startsWith";
import get from "lodash/get";
import lh from "helpers/linkHandler";

export default class LayoutHeader extends Component {
  static displayName = "Layout.Header";

  static propTypes = {
    visibility: PropTypes.object,
    location: PropTypes.object,
    authentication: PropTypes.object,
    notifications: PropTypes.object,
    commonActions: PropTypes.object,
    settings: PropTypes.object
  };

  isProjects(match, location) {
    if (!match) {
      return false;
    }
    const { pathname } = location;
    if (pathname === "/backend") return true;
    if (startsWith(pathname, "/backend/project")) return true;
    if (startsWith(pathname, "/backend/resource")) return true;
    if (startsWith(pathname, "/backend/text")) return true;
    return false;
  }

  isSubjects(match, location) {
    if (!match) {
      return false;
    }
    const { pathname } = location;
    if (startsWith(pathname, "/backend/subjects")) return true;
  }

  render() {
    return (
      <header className={"header-app dark"}>
        <div className="header-container">
          <Link to={lh.link("frontend")} className="logo">
            <PressLogo
              url={get(this.props.settings, "attributes.pressLogoStyles.small")}
            />
          </Link>
          <nav className="text-nav">
            <ul>
              <li>
                <NavLink
                  isActive={this.isProjects}
                  activeClassName="active"
                  to={lh.link("backend")}
                >
                  {"Projects"}
                </NavLink>
              </li>
              <li>
                <NavLink activeClassName="active" to={lh.link("backendPeople")}>
                  {"People"}
                </NavLink>
              </li>
              <li>
                <NavLink
                  activeClassName="active"
                  to={lh.link("backendContent")}
                >
                  {"Content"}
                </NavLink>
              </li>
              <li>
                <NavLink
                  activeClassName="active"
                  to={lh.link("backendSettings")}
                >
                  {"Settings"}
                </NavLink>
              </li>
            </ul>
          </nav>

          <nav className="menu-dropdowns">
            <ul>
              <li className="show-60">
                <Link className="button-mode" to={lh.link("frontend")}>
                  Exit Admin Mode
                </Link>
              </li>
              <li>
                <UserMenuButton
                  authentication={this.props.authentication}
                  active={this.props.visibility.uiPanels.user}
                  showLoginOverlay={
                    this.props.commonActions.toggleSignInUpOverlay
                  }
                  toggleUserMenu={this.props.commonActions.toggleUserPanel}
                />
                <UIPanel
                  id="user"
                  visibility={this.props.visibility.uiPanels}
                  bodyComponent={UserMenuBody}
                  showLoginOverlay={
                    this.props.commonActions.toggleSignInUpOverlay
                  }
                  startLogout={this.props.commonActions.logout}
                  hideUserMenu={this.props.commonActions.toggleUserPanel}
                />
              </li>
            </ul>
          </nav>
        </div>

        <div className="header-border" />

        <HeaderNotifications
          notifications={this.props.notifications}
          addNotification={this.props.commonActions.addNotification}
          removeNotification={this.props.commonActions.removeNotification}
          removeAllNotifications={this.props.commonActions.clearNotifications}
        />
      </header>
    );
  }
}
