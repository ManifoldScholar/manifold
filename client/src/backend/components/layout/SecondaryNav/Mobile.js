import React, { useState } from "react";
import PropTypes from "prop-types";
import { matchPath, useLocation } from "react-router-dom";
import lh from "helpers/linkHandler";
import Authorize from "hoc/Authorize";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

export default function NavigationDropdown({ links, className }) {
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
      <li key={link.route}>
        <Styled.Link
          onClick={close}
          to={pathForLink(link)}
          activeClassName="active"
        >
          {t(link.label)}
        </Styled.Link>
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
      <Styled.Nav className={className}>
        <Styled.Active>{label}</Styled.Active>
      </Styled.Nav>
    );
  };

  const renderMenu = () => {
    return (
      <Styled.Nav className={className}>
        <Styled.Disclosure $open={open} onClick={toggleOpen}>
          <Styled.Active $open={open}>
            {getCurrentLabel()}
            <Styled.Icon icon="disclosureDown16" size="default" $open={open} />
          </Styled.Active>
        </Styled.Disclosure>
        <Styled.List $open={open}>
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
        </Styled.List>
      </Styled.Nav>
    );
  };

  return links.length > 1 ? renderMenu() : renderStatic();
}

NavigationDropdown.displayName = "SecondaryNav.Mobile.Dropdown";

NavigationDropdown.propTypes = {
  links: PropTypes.array,
  classNames: PropTypes.string
};
