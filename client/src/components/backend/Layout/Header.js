import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  UIPanel,
  UserMenuBody,
  UserMenuButton,
  HeaderNotifications,
  PressLogo
} from "components/global";
import HigherOrder from "containers/global/HigherOrder";
import { Link, NavLink } from "react-router-dom";
import startsWith from "lodash/startsWith";
import lh from "helpers/linkHandler";

export default class LayoutHeader extends Component {
  static displayName = "Layout.Header";

  static propTypes = {
    visibility: PropTypes.object,
    location: PropTypes.object,
    authentication: PropTypes.object,
    commonActions: PropTypes.object,
    settings: PropTypes.object,
    isProjects: PropTypes.func
  };

  isSubjects(match, location) {
    if (!match) {
      return false;
    }
    const { pathname } = location;
    if (startsWith(pathname, "/backend/subjects")) return true;
  }

  exitLabel(kind) {
    if (kind === "project_editor" || kind === "project_resource_editor")
      return "Exit Editor Mode";
    if (kind === "project_author") return "Exit Author Mode";
    return "Exit Admin Mode";
  }

  render() {
    const currentUser = this.props.authentication.currentUser;

    return (
      <HigherOrder.BlurOnLocationChange location={this.props.location}>
        <header className={"header-app dark"}>
          <div className="header-container">
            <Link to={lh.link("frontend")} className="logo">
              <span className="screen-reader-text">Return to home</span>
              <PressLogo aria-hidden="true" />
            </Link>
            <nav className="text-nav">
              <ul>
                <li>
                  <NavLink
                    isActive={this.props.isProjects}
                    activeClassName="active"
                    to={lh.link("backend")}
                  >
                    {"Projects"}
                  </NavLink>
                </li>
                <HigherOrder.Authorize
                  entity={["user", "maker"]}
                  ability="update"
                >
                  <li>
                    <NavLink
                      activeClassName="active"
                      to={lh.link("backendPeople")}
                    >
                      {"People"}
                    </NavLink>
                  </li>
                </HigherOrder.Authorize>
                <HigherOrder.Authorize
                  entity={["page", "feature"]}
                  ability="update"
                >
                  <li>
                    <NavLink
                      activeClassName="active"
                      to={lh.link("backendContent")}
                    >
                      {"Content"}
                    </NavLink>
                  </li>
                </HigherOrder.Authorize>
                <HigherOrder.Authorize entity="settings" ability="update">
                  <li>
                    <NavLink
                      activeClassName="active"
                      to={lh.link("backendSettings")}
                    >
                      {"Settings"}
                    </NavLink>
                  </li>
                </HigherOrder.Authorize>
              </ul>
            </nav>

            <nav className="menu-dropdowns">
              <ul>
                <li className="show-60">
                  <Link className="button-mode" to={lh.link("frontend")}>
                    {this.exitLabel(currentUser.attributes.kind)}
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
                    hidePanel={this.props.commonActions.toggleUserPanel}
                  />
                </li>
              </ul>
            </nav>
          </div>

          <div className="header-border" />
          <HeaderNotifications scope="global" />
        </header>
      </HigherOrder.BlurOnLocationChange>
    );
  }
}
