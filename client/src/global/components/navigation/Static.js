import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import SearchMenu from "global/components/search/menu";
import UserMenuButton from "global/components/user-menu-button";
import UserMenuBody from "global/components/user-menu-body";
import UIPanel from "global/components/ui-panel";
import { NavLink, withRouter } from "react-router-dom";
import lh from "helpers/linkHandler";

import Authorize from "hoc/authorize";

export class NavigationStatic extends PureComponent {
  static displayName = "Navigation.Static";

  static propTypes = {
    links: PropTypes.array,
    classNames: PropTypes.string,
    location: PropTypes.object,
    authentication: PropTypes.object,
    visibility: PropTypes.object,
    commonActions: PropTypes.object.isRequired,
    backendButton: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    mode: PropTypes.oneOf(["backend", "frontend"]).isRequired,
    exact: PropTypes.bool,
    style: PropTypes.object
  };

  static defaultProps = {
    exact: false
  };

  pathForLink(link) {
    const args = link.args || [];
    return lh.link(link.route, ...args);
  }

  renderExternalLink(link) {
    return (
      <a
        href={link.externalUrl}
        target={link.newTab ? "_blank" : null}
        rel="noopener noreferrer"
      >
        {link.label}
      </a>
    );
  }

  renderManifoldLink(link) {
    const exact = this.pathForLink(link) === "/" ? true : this.props.exact;
    return (
      <NavLink
        to={this.pathForLink(link)}
        exact={exact}
        target={link.newTab ? "_blank" : null}
        activeClassName="active"
      >
        {link.label}
      </NavLink>
    );
  }

  renderStaticItem(link, index) {
    if (link.hideInNav) return null;
    return (
      <li key={`${link.label}-${index}`}>
        {link.route
          ? this.renderManifoldLink(link)
          : this.renderExternalLink(link)}
      </li>
    );
  }

  renderSearch(props) {
    if (props.mode === "backend") return null;

    return (
      <li>
        <SearchMenu.Button
          toggleSearchMenu={this.props.commonActions.toggleSearchPanel}
          active={this.props.visibility.uiPanels.search}
        />
        <UIPanel
          id="search"
          toggleVisibility={this.props.commonActions.toggleSearchPanel}
          visibility={this.props.visibility.uiPanels}
          bodyComponent={SearchMenu.Body}
          searchType="frontend"
          initialState={{
            keyword: "",
            facets: ["Project", "Resource", "Text"]
          }}
          description="Search across all content and projects"
          hidePanel={this.props.commonActions.hideSearchPanel}
        />
      </li>
    );
  }

  renderUserMenu(props) {
    return (
      <nav className="user-links show-75">
        <ul style={this.props.style}>
          {this.props.backendButton && <li>{this.props.backendButton}</li>}
          {this.renderSearch(props)}
          <li>
            <UserMenuButton
              authentication={props.authentication}
              active={props.visibility.uiPanels.user}
              showLoginOverlay={props.commonActions.toggleSignInUpOverlay}
              toggleUserMenu={props.commonActions.toggleUserPanel}
            />
            <UIPanel
              id="user"
              visibility={props.visibility.uiPanels}
              bodyComponent={UserMenuBody}
              showLoginOverlay={props.commonActions.toggleSignInUpOverlay}
              startLogout={props.commonActions.logout}
              hideUserMenu={props.commonActions.toggleUserPanel}
              hidePanel={props.commonActions.hideUserPanel}
            />
          </li>
        </ul>
      </nav>
    );
  }

  render() {
    return (
      <React.Fragment>
        <nav className="page-nav show-75">
          <ul style={this.props.style} className="links">
            {this.props.links.map((link, index) => {
              if (link.ability)
                return (
                  <Authorize
                    key={`${link.route}-wrapped`}
                    entity={link.entity}
                    ability={link.ability}
                  >
                    {this.renderStaticItem(link, index)}
                  </Authorize>
                );
              return this.renderStaticItem(link, index);
            })}
          </ul>
        </nav>
        {this.renderUserMenu(this.props)}
      </React.Fragment>
    );
  }
}

export default withRouter(NavigationStatic);
