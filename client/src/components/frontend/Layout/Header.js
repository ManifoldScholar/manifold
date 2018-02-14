import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  HeaderNotifications,
  UIPanel,
  UserMenuBody,
  UserMenuButton,
  PressLogo
} from "components/global";
import { Link } from "react-router-dom";
import startsWith from "lodash/startsWith";
import get from "lodash/get";
import HigherOrder from "containers/global/HigherOrder";
import lh from "helpers/linkHandler";

export default class LayoutHeader extends PureComponent {
  static displayName = "Layout.Header";

  static propTypes = {
    visibility: PropTypes.object,
    location: PropTypes.object,
    authentication: PropTypes.object,
    notifications: PropTypes.object,
    commonActions: PropTypes.object,
    settings: PropTypes.object,
    pages: PropTypes.array
  };

  static defaultProps = {
    pages: []
  };

  visiblePages(props) {
    if (!props.pages) return [];
    return props.pages.filter(p => {
      return p.attributes.showInHeader && !p.attributes.hidden;
    });
  }

  render() {
    const path = this.props.location.pathname;
    const projectsActive = path === "/" || startsWith(path, "/project");
    const followingActive = startsWith(path, "/following");

    return (
      <header className={"header-app"}>
        <div className="header-container">
          <Link to={lh.link("frontend")} className="logo">
            <PressLogo
              url={get(
                this.props.settings,
                "attributes.pressLogoStyles.original"
              )}
              styles={get(this.props.settings, "attributes.theme.logoStyles")}
            />
          </Link>
          {/* Use show-50 utility class to hide text-nav on mobile */}
          <nav className="text-nav show-50">
            <ul>
              <li className={projectsActive ? "active" : ""}>
                <Link to={lh.link("frontend")}>{"Projects"}</Link>
              </li>
              <HigherOrder.RequireKind requiredKind="any">
                <li className={followingActive ? "active" : ""}>
                  <Link to={lh.link("frontendFollowing")}>{"Following"}</Link>
                </li>
              </HigherOrder.RequireKind>
              {this.visiblePages(this.props).map(page => {
                const url = lh.link("frontendPage", page.attributes.slug);
                return (
                  <li key={page.id} className={path === url ? "active" : ""}>
                    <Link to={url}>
                      {page.attributes.navTitle || page.attributes.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <nav className="menu-dropdowns">
            <ul>
              <HigherOrder.RequireKind requiredKind={"admin"}>
                <li>
                  <Link className="button-mode" to={lh.link("backend")}>
                    Admin Mode
                  </Link>
                </li>
              </HigherOrder.RequireKind>

              {/*
                Hiding search markup until functionality is available
                <li>
                  <SearchMenuButton
                    toggleSearchMenu={this.props.commonActions.toggleSearchPanel}
                    active={this.props.visibility.uiPanels.search}
                  />
                  <UIPanel
                    id="search"
                    visibility={this.props.visibility.uiPanels}
                    bodyComponent={SearchMenuBody}
                  />
                </li>
              */}
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
