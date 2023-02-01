import React, { useState } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { matchPath, useLocation } from "react-router-dom";
import classnames from "classnames";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";
import Authorize from "hoc/Authorize";
import { useTranslation } from "react-i18next";

export default function NavigationDropdown({ links, classNames }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const visitLinks = () => {
    const activeLink = links.find(link => {
      const route = lh.routeFromName(link.route);
      return matchPath(pathname, route) !== null;
    });
    if (activeLink && activeLink.children) {
      return visitLinks(activeLink.children);
    }
    return activeLink;
  };

  const getCurrentLabel = () => {
    const selected = visitLinks(links);
    if (!selected) return "";
    return selected.headerLabel || t(selected.label);
  };

  const toggleOpen = () => {
    setOpen(!open);
  };

  const close = () => {
    setOpen(false);
  };

  const pathForLink = link => {
    const args = link.args || [];
    return lh.link(link.route, ...args);
  };

  const renderItem = link => {
    return (
      <li key={link.route} className="dropdown-nav__nav-item">
        <NavLink
          onClick={close}
          to={pathForLink(link)}
          className="dropdown-nav__link"
          activeClassName="dropdown-nav__link--active"
        >
          {t(link.label)}
        </NavLink>
      </li>
    );
  };

  const getSelected = () => {
    // this was refactored out at some point. TODO: Circle back.
    return null;
  };

  const renderStatic = () => {
    const selected = getSelected();
    const label = selected ? selected.label : t("navigation.menu");

    return (
      <nav className={`dropdown-nav dropdown-nav--static ${classNames}`}>
        <div className="dropdown-nav__selected">{label}</div>
      </nav>
    );
  };

  const renderMenu = () => {
    const navClasses = classnames({
      "dropdown-nav": true,
      "dropdown-nav--open": open
    });

    return (
      <nav className={`${navClasses} ${classNames}`}>
        <button className="dropdown-nav__trigger" onClick={toggleOpen}>
          <div className="dropdown-nav__selected">
            {getCurrentLabel()}
            <IconComposer
              icon="disclosureDown16"
              size="default"
              className="dropdown-nav__trigger-icon"
            />
          </div>
        </button>
        <ul className="dropdown-nav__nav-list">
          {links.map(link => {
            if (link.ability)
              return (
                <Authorize
                  key={`${link.route}-wrapped`}
                  entity={link.entity}
                  ability={link.ability}
                >
                  {renderItem(link)}
                </Authorize>
              );
            return renderItem(link);
          })}
        </ul>
      </nav>
    );
  };

  return links.length > 1 ? renderMenu() : renderStatic();
}

NavigationDropdown.displayName = "Navigation.Dropdown";

NavigationDropdown.propTypes = {
  links: PropTypes.array,
  classNames: PropTypes.string
};
