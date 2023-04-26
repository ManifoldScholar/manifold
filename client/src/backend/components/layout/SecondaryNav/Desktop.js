import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import classnames from "classnames";
import lh from "helpers/linkHandler";
import Authorize from "hoc/Authorize";
import { useTranslation } from "react-i18next";

export default function NavigationSecondary(props) {
  const { ariaLabel, links, panel } = props;
  const { t } = useTranslation();

  const pathForLink = link => {
    const args = link.args || [];
    return lh.link(link.route, ...args);
  };

  const renderItem = link => {
    return (
      <li key={link.route}>
        <NavLink to={pathForLink(link)} activeClassName="active">
          {t(link.label)}
        </NavLink>
      </li>
    );
  };

  const getAriaLabel = () => {
    if (ariaLabel) {
      return ariaLabel;
    } else {
      return t("navigation.secondary");
    }
  };

  const renderContents = () => {
    const navClasses = classnames({
      "secondary-nav": true,
      "panel-nav": panel
    });

    return (
      <nav className={navClasses} aria-label={getAriaLabel()}>
        <ul>
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

  const renderPanel = () => {
    return <aside className="aside">{renderContents(props)}</aside>;
  };

  const renderNav = () => {
    if (panel) return renderPanel(props);
    return renderContents(props);
  };

  return renderNav();
}

NavigationSecondary.displayName = "Layout.SecondaryNav";

NavigationSecondary.propTypes = {
  links: PropTypes.array,
  panel: PropTypes.bool,
  ariaLabel: PropTypes.string
};
