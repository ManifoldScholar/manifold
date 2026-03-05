import { useState } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import Authorize from "hoc/Authorize";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

export default function NavigationDropdown({ links, className }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();

  const visitLinks = linkList => {
    const activeLink = linkList.find(link =>
      location.pathname.startsWith(link.path)
    );
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

  const pathForLink = link => link.path;

  const renderItem = link => {
    return (
      <li key={link.path}>
        <Styled.Link
          onClick={close}
          to={pathForLink(link)}
          className={({ isActive }) => (isActive ? "active" : undefined)}
        >
          {t(link.label)}
        </Styled.Link>
      </li>
    );
  };

  const renderStatic = () => {
    return (
      <Styled.Nav className={className}>
        <Styled.Active>{t("navigation.menu")}</Styled.Active>
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
            if (link.ability || link.kind)
              return (
                <Authorize
                  key={`${link.path}-wrapped`}
                  entity={link.entity}
                  ability={link.ability}
                  kind={link.kind}
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
