import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import classNames from "classnames";
import SearchMenu from "global/components/search/menu";
import UserMenuButton from "global/components/UserMenuButton";
import UserMenuBody from "global/components/UserMenuBody";
import UIPanel from "global/components/UIPanel";
import { NavLink, withRouter } from "react-router-dom";
import lh from "helpers/linkHandler";
import { FrontendModeContext } from "helpers/contexts";
import withSettings from "hoc/withSettings";
import Authorize from "hoc/Authorize";

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
    style: PropTypes.object,
    darkTheme: PropTypes.bool,
    t: PropTypes.func
  };

  static contextType = FrontendModeContext;

  static defaultProps = {
    exact: false
  };

  get userMenuClasses() {
    return classNames({
      "user-nav": true,
      "show-75": true,
      "user-nav--dark": this.props.darkTheme
    });
  }

  get siteNavClasses() {
    return classNames({
      "site-nav": true,
      "show-75": true,
      "site-nav--backend": this.props.mode === "backend"
    });
  }

  get hasLinks() {
    return this.props.links && this.props.links.length > 0;
  }

  get isLibraryDisabled() {
    return this.props.settings.attributes.general.libraryDisabled;
  }

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
        className="site-nav__link"
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
        className="site-nav__link"
        activeClassName="site-nav__link--active"
      >
        {link.label}
      </NavLink>
    );
  }

  renderStaticItem(link, index) {
    if (link.hideInNav) return null;
    return (
      <li key={`${link.label}-${index}`} className="site-nav__item">
        {link.route
          ? this.renderManifoldLink(link)
          : this.renderExternalLink(link)}
      </li>
    );
  }

  renderSearch(props) {
    if (props.mode === "backend") return null;
    const t = this.props.t;

    const scopeToProject =
      this.context.isStandalone ||
      Boolean(this.isLibraryDisabled && this.context.project);

    const description = scopeToProject
      ? t("utility.search.description_project_scope")
      : t("utility.search.description_full_scope");
    const projectId = scopeToProject ? this.context.project.id : null;

    return (
      <li className="user-nav__item">
        <SearchMenu.Button
          toggleSearchMenu={this.props.commonActions.toggleSearchPanel}
          active={this.props.visibility.uiPanels.search}
          className="user-nav__button user-nav__button--search"
        />
        <UIPanel
          id="search"
          toggleVisibility={this.props.commonActions.toggleSearchPanel}
          visibility={this.props.visibility.uiPanels}
          bodyComponent={SearchMenu.Body}
          searchType={projectId ? "project" : "library"}
          projectId={projectId}
          initialState={{
            keyword: ""
          }}
          description={description}
          hidePanel={this.props.commonActions.hideSearchPanel}
        />
      </li>
    );
  }

  renderUserMenu(props) {
    const t = this.props.t;
    return (
      <nav className={this.userMenuClasses}>
        <ul
          aria-label={t("navigation.user_links")}
          style={this.props.style}
          className="user-nav__list"
        >
          {this.props.backendButton && (
            <li className="user-nav__item user-nav__item--align-center">
              {this.props.backendButton}
            </li>
          )}
          {this.renderSearch(props)}
          <li className="user-nav__item">
            <UserMenuButton
              authentication={props.authentication}
              active={props.visibility.uiPanels.user}
              showLoginOverlay={props.commonActions.toggleSignInUpOverlay}
              toggleUserMenu={props.commonActions.toggleUserPanel}
              context={props.mode}
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

  renderSiteNav() {
    const t = this.props.t;
    return (
      <nav className={this.siteNavClasses} aria-label={t("navigation.primary")}>
        <ul
          aria-label={t("navigation.page_links")}
          style={this.props.style}
          className="site-nav__list"
        >
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
    );
  }

  render() {
    return (
      <>
        {this.hasLinks && this.renderSiteNav()}
        {this.renderUserMenu(this.props)}
      </>
    );
  }
}

export default withTranslation()(withRouter(withSettings(NavigationStatic)));
