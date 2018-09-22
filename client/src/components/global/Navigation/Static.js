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
import lh from "helpers/linkHandler";

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

  renderStaticItem(link) {
    /*
    Top level links are always exact, or else the / home page link will be active for
    /following and /page1
    */
    if (link.hideInNav) return null;
    return (
      <li key={link.route}>
        <NavLink
          to={this.pathForLink(link)}
          exact={this.props.exact}
          activeClassName="active"
        >
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
          toggleSearchMenu={this.props.commonActions.toggleSearchPanel}
          active={this.props.visibility.uiPanels.search}
        />
        <UIPanel
          id="search"
          toggleVisibility={this.props.commonActions.toggleSearchPanel}
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
      <nav className="text-nav show-75">
        <div className="links-wrapper">
          <ul style={this.props.style} className="links">
            {this.props.links.map(link => {
              if (link.ability)
                return (
                  <HigherOrder.Authorize
                    key={`${link.route}-wrapped`}
                    entity={link.entity}
                    ability={link.ability}
                  >
                    {this.renderStaticItem(link)}
                  </HigherOrder.Authorize>
                );
              return this.renderStaticItem(link);
            })}
          </ul>
        </div>
        {this.renderUserMenu(this.props)}
      </nav>
    );
  }
}

export default withRouter(NavigationStatic);
