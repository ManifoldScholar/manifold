import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  UIPanel,
  UserMenuBody,
  UserMenuButton,
  Search
} from "components/global";
import { HigherOrder } from "containers/global";
import { NavLink, withRouter } from "react-router-dom";

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
    mode: PropTypes.oneOf(["backend", "frontend"]).isRequired
  };

  renderStaticItem(link) {
    return (
      <li key={link.key}>
        <NavLink to={link.path} activeClassName="active" isActive={link.isActive}>
          {link.label}
        </NavLink>
      </li>
    );
  }

  renderSearch(props) {
    if (props.mode === "backend") return null;

    return (
      <li>
        <Search.Menu.Button
          toggleSearchMenu={
            this.props.commonActions.toggleSearchPanel
          }
          active={this.props.visibility.uiPanels.search}
        />
        <UIPanel
          id="search"
          toggleVisibility={
            this.props.commonActions.toggleSearchPanel
          }
          visibility={this.props.visibility.uiPanels}
          bodyComponent={Search.Menu.Body}
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
      <nav className="user-links">
        <ul>
          <li>
            {this.props.backendButton}
          </li>
          {this.renderSearch(props)}
          <li>
            <UserMenuButton
              authentication={props.authentication}
              active={props.visibility.uiPanels.user}
              showLoginOverlay={
                props.commonActions.toggleSignInUpOverlay
              }
              toggleUserMenu={props.commonActions.toggleUserPanel}
            />
            <UIPanel
              id="user"
              visibility={props.visibility.uiPanels}
              bodyComponent={UserMenuBody}
              showLoginOverlay={
                props.commonActions.toggleSignInUpOverlay
              }
              startLogout={props.commonActions.logout}
              hideUserMenu={props.commonActions.toggleUserPanel}
              hidePanel={props.commonActions.toggleUserPanel}
            />
          </li>
        </ul>
      </nav>
    );
  }

  render() {
    return (
      <nav className="text-nav show-75">
        <ul className="links">
          {this.props.links.map(link => {
            if (link.ability)
              return (
                <HigherOrder.Authorize
                  key={`${link.key}-wrapped`}
                  entity={link.entity}
                  ability={link.ability}
                >
                  {this.renderStaticItem(link)}
                </HigherOrder.Authorize>
              );
            return this.renderStaticItem(link);
          })}
        </ul>
        {this.renderUserMenu(this.props)}
      </nav>
    )
  }
}

export default withRouter(NavigationStatic);
