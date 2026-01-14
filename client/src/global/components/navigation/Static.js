import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { NavLink } from "react-router-dom";
import SearchMenu from "global/components/search/menu";
import UserMenuButton from "global/components/UserMenuButton";
import UserMenuBody from "global/components/UserMenuBody";
import UIPanel from "global/components/UIPanel";
import DisclosureNavigationMenu from "global/components/atomic/DisclosureNavigationMenu";
import lh from "helpers/linkHandler";
import { FrontendModeContext } from "helpers/contexts";
import Authorize from "hoc/Authorize";
import { useFromStore, useShowJournalsActive } from "hooks";
import { commonActions } from "actions/helpers";
import { requests } from "api";

export default function NavigationStatic({
  links,
  backendButton,
  mode,
  exact = false,
  style,
  darkTheme
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const context = useContext(FrontendModeContext);
  const journalIsActive = useShowJournalsActive();

  const visibility = useFromStore({ path: "ui.transitory.visibility" });
  const settings = useFromStore({
    requestKey: requests.settings,
    action: "select"
  });

  const commonActionsHelper = commonActions(dispatch);

  const userMenuClasses = classNames({
    "user-nav": true,
    "show-82": mode === "frontend",
    "show-100": mode === "backend",
    "user-nav--dark": darkTheme
  });

  const siteNavClasses = classNames({
    "site-nav": true,
    "show-82": mode === "frontend",
    "show-100": mode === "backend",
    "site-nav--backend": mode === "backend"
  });

  const hasLinks = links && links.length > 0;

  const isLibraryDisabled = settings.attributes.general.libraryDisabled;

  const pathForLink = link => {
    const args = link.args || [];
    return lh.link(link.route, ...args);
  };

  const renderExternalLink = link => {
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
  };

  const getClassNameForLink = link => {
    let baseClassName = "site-nav__link";
    let shouldShowActive = true;

    if (typeof journalIsActive !== "boolean") {
      if (link.label.includes("projects")) {
        shouldShowActive = false;
      }
    } else if (journalIsActive) {
      if (link.label.includes("projects")) {
        shouldShowActive = false;
      } else if (link.label.includes("journals")) {
        baseClassName = "site-nav__link site-nav__link--active";
        shouldShowActive = false;
      }
    }

    return ({ isActive }) => {
      if (!shouldShowActive) {
        return baseClassName;
      }
      return classNames(baseClassName, {
        "site-nav__link--active": isActive
      });
    };
  };

  const renderManifoldLink = link => {
    const path = pathForLink(link);
    const linkEnd = path === "/" ? true : exact;
    return (
      <NavLink
        to={path}
        end={linkEnd}
        target={link.newTab ? "_blank" : null}
        className={getClassNameForLink(link)}
      >
        {t(link.label)}
      </NavLink>
    );
  };

  const renderStaticItem = (link, index) => {
    if (link.hideInNav) return null;
    if (link.dropdown) {
      const Toggle = link.toggle;
      return (
        <li key={`${link.label}-${index}`} className="site-nav__item">
          <DisclosureNavigationMenu
            key={`${link.label}-${index}`}
            disclosure={
              <Toggle
                link={link}
                index={index}
                journalIsActive={journalIsActive}
              />
            }
          >
            {link.dropdownContent}
          </DisclosureNavigationMenu>
        </li>
      );
    }
    return (
      <li key={`${link.label}-${index}`} className="site-nav__item">
        {link.route ? renderManifoldLink(link) : renderExternalLink(link)}
      </li>
    );
  };

  const renderSearch = () => {
    if (mode === "backend") return null;

    const scopeToProject =
      context.isStandalone || Boolean(isLibraryDisabled && context.project);

    const description = scopeToProject
      ? t("search.description_project_scope")
      : t("search.description_full_scope");
    const projectId = scopeToProject ? context.project.id : null;

    return (
      <li className="user-nav__item">
        <SearchMenu.Button
          toggleSearchMenu={commonActionsHelper.toggleSearchPanel}
          active={visibility.uiPanels.search}
          className="user-nav__button user-nav__button--search"
        />
        <UIPanel
          id="search"
          visibility={visibility.uiPanels}
          bodyComponent={SearchMenu.Body}
          bodyClassName="search-menu"
          searchType={projectId ? "project" : "library"}
          projectId={projectId}
          initialState={{
            keyword: ""
          }}
          description={description}
          hidePanel={commonActionsHelper.hideSearchPanel}
          afterSubmit={commonActionsHelper.hideSearchPanel}
        />
      </li>
    );
  };

  const renderUserMenu = () => {
    return (
      <nav className={userMenuClasses}>
        <ul
          aria-label={t("navigation.user_links")}
          style={style}
          className="user-nav__list"
        >
          {backendButton && (
            <li className="user-nav__item user-nav__item--align-center">
              {backendButton}
            </li>
          )}
          {renderSearch()}
          <li className="user-nav__item">
            <DisclosureNavigationMenu
              visible={visibility.uiPanels.user}
              disclosure={<UserMenuButton />}
              callbacks={commonActionsHelper}
              onBlur={commonActionsHelper.hideUserPanel}
              context={mode}
            >
              <UserMenuBody />
            </DisclosureNavigationMenu>
          </li>
        </ul>
      </nav>
    );
  };

  const renderSiteNav = () => {
    return (
      <nav className={siteNavClasses} aria-label={t("navigation.primary")}>
        <ul
          aria-label={t("navigation.page_links")}
          style={style}
          className="site-nav__list"
        >
          {links.map((link, index) => {
            if (link.ability || link.kind)
              return (
                <Authorize
                  key={`${link.route}-wrapped`}
                  entity={link.entity}
                  ability={link.ability}
                  kind={link.kind}
                >
                  {renderStaticItem(link, index)}
                </Authorize>
              );
            return renderStaticItem(link, index);
          })}
        </ul>
      </nav>
    );
  };

  return (
    <>
      {hasLinks && renderSiteNav()}
      {renderUserMenu()}
    </>
  );
}

NavigationStatic.displayName = "Navigation.Static";

NavigationStatic.propTypes = {
  links: PropTypes.array,
  backendButton: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  mode: PropTypes.oneOf(["backend", "frontend"]).isRequired,
  exact: PropTypes.bool,
  style: PropTypes.object,
  darkTheme: PropTypes.bool
};
