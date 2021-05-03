import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { NavLink } from "react-router-dom";
import IconComposer from "global/components/utility/IconComposer";

function ChildNavigation({ ariaLabel, links, layout = "grid", padLinks }) {
  return (
    <nav
      aria-label={ariaLabel}
      className={classNames({
        "group-child-nav": true,
        [`group-child-nav--count-${links.length}`]: true,
        [`group-child-nav--layout-${layout}`]: true
      })}
    >
      {links.map(({ to, exact, isActive, text, icon }) => (
        <NavLink
          key={text}
          to={to}
          exact={exact}
          isActive={isActive}
          className={classNames({
            "group-child-nav__link": true,
            "group-child-nav__link--padded": padLinks
          })}
          activeClassName="group-child-nav__link--active"
        >
          {icon && <IconComposer icon={icon} size="default" />}
          <span className="group-child-nav__link-text">{text}</span>
        </NavLink>
      ))}
    </nav>
  );
}

ChildNavigation.displayName = "ReadingGroup.Heading.ChildNavigation";

ChildNavigation.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      icon: PropTypes.string,
      exact: PropTypes.bool,
      isActive: PropTypes.func
    }).isRequired
  ).isRequired,
  layout: PropTypes.oneOf(["flex", "grid"]),
  padLinks: PropTypes.bool
};

export default ChildNavigation;
