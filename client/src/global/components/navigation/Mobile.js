import {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
  useRef
} from "react";
import PropTypes from "prop-types";
import { useLocation, NavLink, useMatches } from "react-router-dom";
import classnames from "classnames";
import { useTranslation } from "react-i18next";
import { useFromStore, useShowJournalsActive } from "hooks";
import lh from "helpers/linkHandler";
import memoize from "lodash/memoize";
import UserLinks from "./mobile-components/UserLinks";
import MobileSearch from "./mobile-components/Search";
import MobileBreadcrumb from "./mobile-components/Breadcrumb";
import { FocusTrap } from "focus-trap-react";
import IconComposer from "global/components/utility/IconComposer";
import { FrontendModeContext } from "helpers/contexts";
import Authorize from "hoc/Authorize";
import BodyClass from "hoc/BodyClass";
import { useDispatch } from "react-redux";
import { commonActions } from "actions/helpers";

export default function NavigationMobile({ links, backendButton, mode }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const location = useLocation();
  const matches = useMatches();
  const context = useContext(FrontendModeContext);
  const authentication = useFromStore({ path: "authentication" });
  const journalIsActive = useShowJournalsActive();

  const commonActionsHelper = commonActions(dispatch);

  const initialState = {
    expanded: [],
    open: false
  };

  const [state, setState] = useState(initialState);

  const hasLinks = links && links.length > 0;
  const isStandalone = context.isStandalone;

  const pathForLink = link => {
    const args = link.args || [];
    return lh.link(link.route, ...args);
  };

  const activeRoutes = useMemo(() => {
    if (!links) return null;
    const active = [];
    links.forEach(link => {
      // Check if this route is in the current matches by route name
      const routeMatch = matches.find(m => m.handle?.name === link.route);
      if (routeMatch) {
        if (link.route === "frontendProjects" && journalIsActive) {
          active.push("frontendJournals");
        } else if (link.route === "backendProjects" && journalIsActive) {
          active.push("backendJournals");
        } else {
          active.push(link.route);
        }
      }
    });
    if (location.pathname === "/project-collections") {
      active.push("frontendProjects");
    }
    return active;
  }, [links, matches, journalIsActive, location]);

  const prevLocationRef = useRef(location);
  useEffect(() => {
    if (!state.open) {
      prevLocationRef.current = location;
      return;
    }
    if (prevLocationRef.current.pathname !== location.pathname) {
      setState({ expanded: [], open: false });
    }
    prevLocationRef.current = location;
  }, [location, state.open]);

  const expand = useCallback(
    key => {
      if (state.expanded.includes(key)) return;
      setState(prevState => ({
        ...prevState,
        expanded: [...prevState.expanded, key]
      }));
    },
    [state.expanded]
  );

  const collapse = useCallback(
    key => {
      if (!state.expanded.includes(key)) return;
      setState(prevState => ({
        ...prevState,
        expanded: prevState.expanded.filter(k => k !== key)
      }));
    },
    [state.expanded]
  );

  const toggleExpanded = useCallback(
    key => {
      if (state.expanded.includes(key)) {
        collapse(key);
      } else {
        expand(key);
      }
    },
    [state.expanded, expand, collapse]
  );

  const createExpandToggleHandler = useMemo(
    () =>
      memoize(key => {
        return event => {
          event.preventDefault();
          toggleExpanded(key);
        };
      }),
    [toggleExpanded]
  );

  const closeNavigation = useCallback(() => {
    setState({ open: false, expanded: [] });
  }, []);

  const openNavigation = useCallback(() => {
    setState({ open: true, expanded: activeRoutes || [] });
  }, [activeRoutes]);

  const toggleOpen = useCallback(() => {
    if (state.open) {
      closeNavigation();
    } else {
      openNavigation();
    }
  }, [state.open, closeNavigation, openNavigation]);

  const triggerIcon = state.open ? "close32" : "menu32";

  const renderStandaloneHeading = () => {
    if (!isStandalone || !context.project) return null;

    const { titleFormatted, subtitleFormatted } = context.project;

    return (
      <li className="nested-nav__item">
        <div className="nested-nav__standalone-heading">
          {titleFormatted && (
            <div
              className="nested-nav__standalone-title"
              dangerouslySetInnerHTML={{ __html: titleFormatted }}
            />
          )}
          {subtitleFormatted && (
            <div
              className="nested-nav__standalone-subtitle"
              dangerouslySetInnerHTML={{ __html: subtitleFormatted }}
            />
          )}
        </div>
      </li>
    );
  };

  const renderExternalLink = link => {
    return (
      <a
        href={link.externalUrl}
        target={link.newTab ? "_blank" : null}
        rel="noopener noreferrer"
        className="nested-nav__link"
      >
        {link.label}
      </a>
    );
  };

  const renderManifoldLink = link => {
    const path = pathForLink(link);
    const end = path === "/";

    return (
      <NavLink
        to={path}
        end={end}
        onClick={closeNavigation}
        target={link.newTab ? "_blank" : null}
        className={({ isActive }) =>
          classnames("nested-nav__link", {
            active: isActive
          })
        }
      >
        {t(link.label)}
      </NavLink>
    );
  };

  const renderItem = (link, index) => {
    if (link.hideInNav) return null;
    const children = link.children || [];
    const hasChildren = children && children.length > 0;
    const expanded = state.expanded.includes(link.route);
    const wrapperClasses = classnames({
      "nested-nav__item": true,
      "nested-nav__grid-item": true,
      "nested-nav__item--nested": hasChildren,
      "nested-nav__item--open": expanded
    });

    return (
      <li key={`${link.label}-${index}`} className={wrapperClasses}>
        {link.route ? renderManifoldLink(link) : renderExternalLink(link)}
        {hasChildren && (
          <button
            onClick={createExpandToggleHandler(link.route)}
            className="nested-nav__disclosure-button"
            aria-haspopup="true"
            aria-expanded={expanded}
          >
            <span className="screen-reader-text">
              {expanded
                ? t("navigation.mobile.close_submenu")
                : t("navigation.mobile.open_submenu")}
            </span>
            <IconComposer
              icon="disclosureDown16"
              size="default"
              className="nested-nav__disclosure-icon"
            />
          </button>
        )}
        {hasChildren && (
          <ul className="nested-nav__list nested-nav__list--nested">
            {children.map(child => renderItem(child))}
          </ul>
        )}
      </li>
    );
  };

  const renderNavigationMenu = () => {
    return (
      <BodyClass className={"no-scroll"}>
        <FocusTrap
          focusTrapOptions={{
            allowOutsideClick: true,
            escapeDeactivates: closeNavigation
          }}
        >
          <div className="nested-nav__content">
            <ul
              aria-label="Page Links"
              className="nested-nav__list nested-nav__list--primary-links"
            >
              {isStandalone && renderStandaloneHeading()}
              {hasLinks &&
                links.map((link, index) => {
                  if (link.ability || link.kind)
                    return (
                      <Authorize
                        key={`${link.route}-wrapped`}
                        entity={link.entity}
                        ability={link.ability}
                        kind={link.kind}
                      >
                        {renderItem(link, index)}
                      </Authorize>
                    );
                  return renderItem(link, index);
                })}
              {mode === "frontend" && (
                <li className="nested-nav__item">
                  <MobileSearch closeNavigation={closeNavigation} />
                </li>
              )}
            </ul>
            <UserLinks
              authentication={authentication}
              commonActions={commonActionsHelper}
              backendButton={backendButton}
              mode={mode}
              closeNavigation={closeNavigation}
            />
          </div>
        </FocusTrap>
      </BodyClass>
    );
  };

  const navClasses = classnames({
    "hide-82": mode === "frontend",
    "hide-100": mode === "backend",
    "nested-nav": true,
    "nested-nav--open": state.open,
    "nested-nav--dark": mode === "backend"
  });

  return (
    <>
      {hasLinks && (
        <MobileBreadcrumb links={links} journalIsActive={journalIsActive} />
      )}
      <nav
        className={navClasses}
        aria-label={t("navigation.mobile.aria_label")}
      >
        {state.open && renderNavigationMenu()}
      </nav>
      <button
        onClick={toggleOpen}
        className="mobile-nav-toggle"
        aria-haspopup
        aria-expanded={state.open}
      >
        <span className="screen-reader-text">
          {state.open
            ? t("navigation.mobile.toggle_closed")
            : t("navigation.mobile.toggle_open")}
        </span>
        <IconComposer
          icon={triggerIcon}
          size="default"
          className="mobile-nav-trigger__icon"
        />
      </button>
    </>
  );
}

NavigationMobile.displayName = "Navigation.Mobile";

NavigationMobile.propTypes = {
  links: PropTypes.array,
  backendButton: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  mode: PropTypes.oneOf(["backend", "frontend"]).isRequired
};
